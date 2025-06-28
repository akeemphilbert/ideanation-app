import { defineEventHandler } from "h3";
import { AzureChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    })

    const writer = event.node.res
    
    const body = await readBody(event)
    //TODO: Implement the logic to stream the response from the Azure OpenAI API
    const llm = new AzureChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
        maxTokens: undefined,
        azureOpenAIApiKey: config.azureOpenAI.apiKey,
        azureOpenAIApiVersion: config.azureOpenAI.apiVersion,
        azureOpenAIBasePath: config.azureOpenAI.basePath,
        azureOpenAIApiDeploymentName: config.azureOpenAI.deployment,
    })

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant."],
        ["user", "{input}"],
    ])
    


    const chain = prompt.pipe(llm);
    const stream = await chain.stream({
        input: body.message,
    });

    for await (const chunk of stream) {
        writer.write(`${chunk.content}`)
    }

    writer.end()
})
