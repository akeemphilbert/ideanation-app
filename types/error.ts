export class AgentGraphError {
  title: string;
  content: string;
  lastNode: string;

  constructor(title: string, content: string, lastNode: string) {
    this.title = title;
    this.content = content;
    this.lastNode = lastNode;
  }
}
