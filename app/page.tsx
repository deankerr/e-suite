import { Markdown } from '@/components/Markdown'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <main className="mx-auto bg-base-100">
        <h1>pabel</h1>
        <div className="">
          <article className="prose">
            <Markdown>{mdText}</Markdown>
          </article>
        </div>
        <div className="prose">
          <p>
            Eiusmod sit ad anim in **consectetur** adipisicing *mollit* ipsum ex ea. Aliquip
            proident laboris labore culpa ullamco. Elit occaecat officia in cupidatat culpa nisi
            aliquip. Ut nostrud id adipisicing do labore.
          </p>

          <p>
            Ipsum mollit adipisicing esse et quis aute occaecat aliquip fugiat. Nostrud amet
            consectetur tempor incididunt ipsum esse. Excepteur ullamco officia elit esse ex laboris
            enim officia adipisicing excepteur quis elit duis laboris. Ex aliquip velit et ad duis
            minim cupidatat adipisicing excepteur duis dolore officia. Voluptate velit mollit
            proident aliqua aliquip ex aliquip ipsum do.
          </p>

          <p>
            Nisi labore ad minim sint nostrud cupidatat duis aliquip. Consequat consectetur aliquip
            laboris incididunt id ipsum ut adipisicing consectetur proident cupidatat anim non
            ullamco consectetur. Laboris consequat ad non nulla veniam adipisicing aute Lorem
            nostrud. Ex veniam ullamco cupidatat elit occaecat sunt veniam aute ut Lorem occaecat
            esse sit. Laboris ea proident consequat in duis et amet cupidatat.
          </p>
        </div>
      </main>
    </>
  )
}

const mdText = `
# Ahoy!

Eiusmod sit ad anim in **consectetur** adipisicing *mollit* ipsum ex ea. Aliquip proident laboris
labore culpa ullamco. Elit occaecat officia in cupidatat culpa nisi aliquip. Ut nostrud id
adipisicing do labore.

Ipsum mollit adipisicing esse et quis aute occaecat aliquip fugiat. Nostrud amet consectetur
tempor incididunt ipsum esse. Excepteur ullamco officia elit esse ex laboris enim officia
adipisicing excepteur quis elit duis laboris. Ex aliquip velit et ad duis minim cupidatat
adipisicing excepteur duis dolore officia. Voluptate velit mollit proident aliqua aliquip ex
aliquip ipsum do.

Nisi labore ad minim sint nostrud cupidatat duis aliquip. Consequat consectetur aliquip
laboris incididunt id ipsum ut adipisicing consectetur proident cupidatat anim non ullamco
consectetur. Laboris consequat ad non nulla veniam adipisicing aute Lorem nostrud. Ex veniam
ullamco cupidatat elit occaecat sunt veniam aute ut Lorem occaecat esse sit. Laboris ea
proident consequat in duis et amet cupidatat.

---

1. Dogs
2. Cats
3. Boats
4. Stoats

- Note
- Boar
- Slaw

> These elements extend the basic syntax by adding additional features. Not all Markdown applications support these elements.

| Status Code  | Reason Phrase                |      Description                                  |
|--------------|------------------------------|---------------------------------------------------|
| 200          | OK                           |The request has succeeded.                         |
| 201          | Created                      |The request has been fulfilled and resulted in a new resource being created.|
| 202          | Accepted                     |The request has been accepted for processing, but the processing has not been completed.|
| 204          | No Content                   |The server has fulfilled the request, but does not need to return an entity-body.|
| 301          | Moved Permanently            |The requested resource has been assigned a new permanent URI.|
| 302          | Found                        |The requested resource resides temporarily under a different URI.|
| 400          | Bad Request                  |The request could not be understood by the server.|
| 401          | Unauthorized                 |The request requires user authentication.|
| 403          | Forbidden                    |The server understood the request, but is refusing to fulfill it.|
| 404          | Not Found                    |The server has not found anything matching the Request-URI.|
| 405          | Method Not Allowed           |The method specified in the Request-Line is not allowed for the resource identified by the Request-URI.|
| 500          | Internal Server Error        |The server encountered an unexpected condition and cannot fulfill the request.|
| 503          | Service Unavailable          |The server is currently unable to handle the request due to a temporary overloading or maintenance.|
`
