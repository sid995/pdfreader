import { Pinecone, Vector, utils as PineconeUtils } from "@pinecone-database/pinecone"
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter"
import { downloadFromS3 } from "./s3Server"
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { getEmbeddings } from "./embeddings";
import md5 from 'md5'
import { convertToAscii } from "./utils";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number }
  }
}

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API!,
    environment: process.env.PINECONE_REGION!,
  })
}

export async function loadS3IntoPinecone(fileKey: string) {
  // download and read pdf
  console.log('downloading s3 into file system')
  const file_name = await downloadFromS3(fileKey)
  console.log("file_name", file_name)
  if (!file_name) {
    throw new Error('couldn\'t download from s3')
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name)
  const pages = (await loader.load()) as PDFPage[]

  // split and segment pdf into smaller documents
  const documents = await Promise.all(pages.map(prepareDocument))

  // vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument))

  // upload to pinecone
  const client = await getPineconeClient()
  const pineconeIndex = client.Index('pdfreader')
  const namespace = convertToAscii(fileKey)

  PineconeUtils.chunkedUpsert(pineconeIndex as any, vectors, namespace, 10)

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent)
    const hash = md5(doc.pageContent)
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber
      }
    } as Vector
  } catch (error) {
    console.log('error embedding documents', error)
    throw error
  }
}

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page

  pageContent = pageContent.replace(/\n/g, '')

  const splitter = new RecursiveCharacterTextSplitter()
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};
