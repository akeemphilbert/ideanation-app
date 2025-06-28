import { defineEventHandler } from "h3";
import { AzureChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { loadConfig, validateConfig } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    })

    const writer = event.node.res
    
    try {
        const body = await readBody(event)
        
        // Load configuration from Supabase
        const config = await loadConfig()
        
        // Validate configuration
        if (!validateConfig(config)) {
            writer.write('Error: Missing required Azure OpenAI configuration')
            writer.end()
            return
        }

        // Initialize Azure OpenAI with loaded configuration
        const llm = new AzureChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0.7,
            maxTokens: 1000,
            azureOpenAIApiKey: config.azure.apiKey,
            azureOpenAIApiVersion: config.azure.apiVersion,
            azureOpenAIBasePath: config.azure.basePath,
            azureOpenAIApiDeploymentName: config.azure.deployment,
        })

        // Create a more sophisticated prompt for the startup idea assistant
        const systemPrompt = `You are an expert startup advisor and idea structuring assistant. You help entrepreneurs break down their startup ideas into atomic components and understand relationships between different elements.

Your role is to:
1. Help users identify problems, customers, solutions, features, and business model components
2. Suggest relationships between different components
3. Provide strategic advice on prioritization and validation
4. Guide users through structured thinking frameworks

When users mention specific components, help them think about:
- Problems: What specific pain points are being addressed?
- Customers: Who exactly faces these problems? Be specific about demographics, roles, and contexts
- Features: What specific functionality would solve the problems?
- Jobs to be Done: What tasks are customers trying to accomplish?
- Pains: What frustrations do customers experience?
- Gains: What positive outcomes do customers desire?

Keep responses conversational, helpful, and focused on actionable insights. If users create entities using the format "type: description", acknowledge what they've created and suggest related components or next steps.

Current context: ${body.context ? JSON.stringify(body.context, null, 2) : 'No context provided'}`

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["user", "{input}"],
        ])

        const chain = prompt.pipe(llm);
        
        // Stream the response
        const stream = await chain.stream({
            input: body.message,
        });

        for await (const chunk of stream) {
            if (chunk.content) {
                writer.write(chunk.content)
            }
        }

    } catch (error) {
        console.error('Error in message stream:', error)
        writer.write('Sorry, I encountered an error while processing your message. Please try again.')
    } finally {
        writer.end()
    }
})