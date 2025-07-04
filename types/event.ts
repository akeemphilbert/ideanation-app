import { v4 as uuidv4 } from 'uuid';

export class Event {
  id: string;
  type: string;
  resourceType: string;
  payload: Record<string, any>;
  created: Date;
  updated: Date;
  metadata?: Record<string, any>;

  constructor({
    id,
    type,
    resourceType,
    payload,
    created,
    updated,
    metadata,
  }: {
    id?: string;
    type: string;
    resourceType: string;
    payload: Record<string, any>;
    created: Date;
    updated: Date;
    metadata?: Record<string, any>;
  }) {
    this.id = id ?? uuidv4();
    this.type = type;
    this.resourceType = resourceType;
    this.payload = payload;
    this.created = created;
    this.updated = updated;
    if (metadata) this.metadata = metadata;
  }
}

export interface EventHandler {
  (event: Event): Promise<void> | void;
}

export interface EventSubscription {
  id: string;
  eventType: string;
  handler: EventHandler;
  active: boolean;
}

export interface TriplePayload extends Record<string, any> {
  subject: string;
  predicate: string;
  object: string;
}

export class TripleEvent extends Event {
  payload: TriplePayload;

  constructor({
    type,
    resourceType,
    payload,
    created,
    updated,
    metadata,
  }: {
    type: string;
    resourceType: string;
    payload: TriplePayload;
    created: Date;
    updated: Date;
    metadata?: Record<string, any>;
  }) {
    if (!payload.subject || !payload.predicate || !payload.object) {
      throw new Error('TripleEvent payload must include subject, predicate, and object');
    }
    super({
      id: uuidv4(),
      type,
      resourceType,
      payload,
      created,
      updated,
      metadata,
    });
    this.payload = payload;
  }
} 