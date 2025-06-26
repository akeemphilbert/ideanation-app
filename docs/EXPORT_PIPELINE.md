# Export Pipeline Documentation

## Overview

The Export Pipeline is a 3-stage system that allows users to export their idea data in various formats and save them to different destinations. The pipeline follows the Strategy pattern and is designed to be extensible and maintainable.

## Architecture

The export pipeline consists of three main stages:

1. **Data Builder** - Constructs the data structure for different export types
2. **Formatter** - Formats data into different output formats
3. **Destination** - Handles saving to different destinations

### Stage 1: Export Data Builder

The `ExportDataBuilder` class is responsible for building the data structure based on the export type. It queries the entities store and constructs the appropriate data format.

**Supported Export Types:**
- Business Model Canvas
- SWOT Analysis
- Design Sprint
- Customer Journey
- Feature Roadmap
- Idea Summary

### Stage 2: Export Formatter

The formatter uses the Strategy pattern to format data into different output formats. Each formatter implements the `IExportFormatter` interface.

**Supported Formats:**
- Markdown
- JSON
- CSV
- PDF (placeholder)
- Image (placeholder)

### Stage 3: Export Destination

The destination handler uses the Strategy pattern to save formatted content to different destinations. Each destination implements the `IExportDestination` interface.

**Supported Destinations:**
- Disk (download)
- Google Drive
- Email
- Clipboard

## Usage

### Basic Usage with Composable

```typescript
import { useExport } from '~/composables/useExport'
import { ExportType, ExportFormat, ExportDestination } from '~/types/export'

const {
  executeExport,
  exportAsMarkdown,
  exportAsPDF,
  exportToClipboard,
  isExporting,
  exportProgress
} = useExport()

// Execute a complete export
const result = await executeExport({
  type: ExportType.BUSINESS_MODEL_CANVAS,
  format: ExportFormat.MARKDOWN,
  destination: ExportDestination.DISK
}, ideaId)

// Quick export helpers
await exportAsMarkdown(ExportType.SWOT_ANALYSIS, ideaId)
await exportAsPDF(ExportType.IDEA_SUMMARY, ideaId)
await exportToClipboard(ExportType.FEATURE_ROADMAP, ideaId)
```

### Using the Export Dialog Component

```vue
<template>
  <ExportDialog
    v-model:visible="showExportDialog"
    :idea-id="currentIdeaId"
    @export-complete="handleExportComplete"
  />
</template>

<script setup>
import { ref } from 'vue'

const showExportDialog = ref(false)
const currentIdeaId = ref('idea-123')

const handleExportComplete = (result) => {
  console.log('Export completed:', result)
}
</script>
```

### Direct Pipeline Usage

```typescript
import { ExportPipeline } from '~/services/export/ExportPipeline'
import { ExportType, ExportFormat, ExportDestination } from '~/types/export'

const pipeline = new ExportPipeline()

// Execute complete pipeline
const result = await pipeline.execute({
  type: ExportType.BUSINESS_MODEL_CANVAS,
  format: ExportFormat.MARKDOWN,
  destination: ExportDestination.DISK
}, ideaId)

// Execute individual stages
const data = await pipeline.buildData(ExportType.SWOT_ANALYSIS, ideaId)
const formatted = await pipeline.formatData(data, ExportFormat.JSON)
const saved = await pipeline.saveToDestination(formatted, ExportDestination.CLIPBOARD)
```

## Export Types

### Business Model Canvas

Exports the idea as a structured business model canvas with sections for:
- Key Partners
- Key Activities
- Key Resources
- Value Propositions
- Customer Relationships
- Channels
- Customer Segments
- Cost Structure
- Revenue Streams

### SWOT Analysis

Exports a SWOT analysis with:
- Strengths
- Weaknesses
- Opportunities
- Threats

### Design Sprint

Exports the idea as a design sprint framework with phases:
- Understand
- Define
- Sketch
- Decide
- Prototype
- Test

### Customer Journey

Exports customer journey mapping with:
- Journey stages
- Actions
- Thoughts
- Emotions
- Pain points
- Opportunities

### Feature Roadmap

Exports feature development roadmap with:
- Development phases
- Feature priorities
- Status tracking
- Timeframes

### Idea Summary

Exports a comprehensive summary including:
- Idea details
- Problems solved
- Target customers
- Products
- Features
- Statistics

## Export Formats

### Markdown

Formats the data as structured markdown with headers, lists, and sections. Best for documentation and sharing.

### JSON

Exports the complete data structure as JSON. Useful for data processing and integration with other tools.

### CSV

Flattens the data structure into CSV format. Good for spreadsheet analysis and reporting.

### PDF

Converts markdown to PDF (placeholder implementation). In a real implementation, you'd use libraries like jsPDF or puppeteer.

### Image

Generates a visual representation as PNG (placeholder implementation). Could use canvas API or html2canvas.

## Export Destinations

### Disk

Downloads the file to the user's computer using the browser's download API.

### Google Drive

Uploads the file to Google Drive using the Google Drive API. Requires authentication.

### Email

Opens the user's email client with the file attached (limited by browser security).

### Clipboard

Copies text content to the clipboard. Only works with text-based formats.

## Extending the Pipeline

### Adding a New Export Type

1. Add the new type to the `ExportType` enum in `types/export.ts`
2. Implement the data building logic in `ExportDataBuilder`
3. Add formatting logic to the formatters
4. Update the pipeline's `getAvailableExportTypes()` method

```typescript
// In types/export.ts
export enum ExportType {
  // ... existing types
  NEW_EXPORT_TYPE = 'new_export_type'
}

// In ExportDataBuilder.ts
private buildNewExportType(ideaId: string): ExportData {
  // Implementation
}
```

### Adding a New Format

1. Create a new formatter class implementing `IExportFormatter`
2. Add the format to the `ExportFormat` enum
3. Update the `ExportFormatterFactory`

```typescript
export class NewFormatter implements IExportFormatter {
  async format(data: ExportData): Promise<FormattedContent> {
    // Implementation
  }
}

// In ExportFormatterFactory
static createFormatter(format: ExportFormat): IExportFormatter {
  switch (format) {
    // ... existing cases
    case ExportFormat.NEW_FORMAT:
      return new NewFormatter()
  }
}
```

### Adding a New Destination

1. Create a new destination class implementing `IExportDestination`
2. Add the destination to the `ExportDestination` enum
3. Update the `ExportDestinationFactory`

```typescript
export class NewDestination implements IExportDestination {
  async save(content: FormattedContent, config?: any): Promise<ExportResult> {
    // Implementation
  }
}

// In ExportDestinationFactory
static createDestination(destination: ExportDestination, config?: any): IExportDestination {
  switch (destination) {
    // ... existing cases
    case ExportDestination.NEW_DESTINATION:
      return new NewDestination(config)
  }
}
```

## Error Handling

The pipeline includes comprehensive error handling:

- Validation of export configuration
- Error propagation through all stages
- User-friendly error messages
- Export history tracking
- Success/failure statistics

## Performance Considerations

- The pipeline is asynchronous and non-blocking
- Progress tracking is available for long-running exports
- Export history is limited to prevent memory issues
- Large exports are handled gracefully

## Security Considerations

- File downloads use browser security mechanisms
- Google Drive integration requires proper OAuth flow
- Email attachments are limited by browser security
- No sensitive data is exposed in error messages

## Testing

The export pipeline can be tested using the demo page at `/export-demo`. This page provides:

- Quick export examples
- Full export dialog
- Export history tracking
- Performance statistics

## Future Enhancements

- Real PDF generation using jsPDF or puppeteer
- Advanced image generation with charts and diagrams
- Integration with more cloud storage providers
- Batch export capabilities
- Export templates and customization
- Real-time collaboration features 