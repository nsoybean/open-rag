# open-rag

Exploring Retrieval-Augmented Generation (RAG) for Structured and Unstructured Data

### Overview

This experimental repository delves into the use of Large Language Models (LLMs) and RAG techniques. While most “chat with your document(s)” applications focus on unstructured data (e.g., PDFs), this project explores how LLMs can handle both structured and unstructured data in larger applications.

The project is inspired by the need to make structured entities—like database entries—equally retrievable alongside unstructured documents within a RAG framework.

To make the exploration concrete, this repo uses an AI social media management and marketing application as a practical example. This application generates and publishes social media content to platforms like Twitter, Facebook, and LinkedIn. It uses mongoDB as its main transactional DB.

#### Objectives

1. Investigate how LLMs can retrieve and interact with structured and unstructured data simultaneously.
2. Explore implementation details for integrating structured entities into RAG pipelines.
3. Answer technical questions about data retrieval, including semantic search across all data types while indicating the data source.

---

### Application Example

The AI social media management and marketing application includes:

#### Structured Entities

- Social Media Posts: Content of the posts.
- Writing Styles: Specifications for tone, voice, or style of content.

#### Unstructured Data

- Guides: Reference documents like Facebook Creative Handbook.
- Trends: Insights such as Social Media Marketing in Asia.

This combination of entities provides a diverse dataset for exploring how LLMs retrieve information across multiple data types.

#### Tech stack

- LangChain/Graph: For building RAG pipelines.
- OpenAI API: To leverage state-of-the-art LLMs.
- MongoDB: transactional DB

---

### Questions to Explore

- How can we semantically retrieve data across all entities (structured and unstructured) using keyword-based searches?
- How can entity sources be effectively indicated in retrieval results?

---

### Learnings

#### MongoDB vector search

MongoDB enable vector search queries by creating `vectorSearch` type index. But index is created per collection. And it feels sort of 'manual' and troublesome to query each collection to find all entities which matches the keyword as opposed to having a single vector store where all related entities can be retrieved in a single query.

Pros:

- Application data gets auto-indexed once vector index is created, reducing the need to manually create embedded and storing it in separate vectorDB.
- Able to know the context of retrieved data by looking at collection name.

Cons:

- Need to query each collection to find all related entities.

#### OpenAI Assistant

OpenAI supports assistant and vector store. This provides some abstractions and ease-of-setup as compared to managing our own vector store. But there may be some limitations which needs to be confirmed and resolved:

Pros:

- easy set up

Cons:

- vector store is non accessible outside chat. Internal to LLM.

Limitations:

- Are we able to query assitant's vector store independently? This allows us to get structured data/ augment retrieved data.
- Can we determine the splitting and chunking behaviour of unstructured data. If not, how do we handle semi-structured data such as csv or tables in PDF.
- Putting structured data in vector store loses its business context. For eg, if we index the caption of the following social post, the knowledge base will include cat but unaware that this cat was referred to from a social post. Whats the chance that this chunk will be retrieved when user ask "Retrieve my past social posts where i mentioned about cat".

  ```
  title: "Come to our cat cafe”
  caption: "Who needs a therapist when you have a cat? 🐾✨ The ultimate cuddle buddy and master of mood-lifting purrs”
  ```

#### External Vector store

Separate vector store. Options include pinecone, clickhouse etc.

Pros:

- more control over the indexing/ storing of embeddings in vectorDB

Cons:

- additional step to index and stored application data in separate vector db.

Consideration:

- whether to store all application data in same table with appropriate metatag containing context of application data. So that retrival can be done with single query. Single vector store concept. eg.

```
{
   embeddings: XXX,
   metatags: {
       entity: 'socialMediaPost' | 'writingStyle' | 'knowledgeBase'
       application-id: YYY // only for application data, this references entity in application database
   }
}
```
