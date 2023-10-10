export const sampleMessages = [
  {
    content: 'Give me a glossary of common terms used in serverless function services.',
    role: 'user',
    id: 'oDcsYjF',
  },
  {
    id: 'x3QoktS',
    content:
      '1. AWS Lambda: A service offered by Amazon Web Services (AWS) that automatically runs your code without requiring provisioning or managing servers.\n\n2. FaaS: Function as a Service. In this cloud computing model, developers only focus on individual "functions" in their application, all the operations of the server are managed by the cloud provider. \n\n3. Cold Start: The process of setting up a container to handle a function in response to a particular event. It\'s called a cold start when the container setup time is added on top of the function\'s execution time.\n\n4. Function: A single-purpose code that is deployed to, and executes in a serverless environment. \n\n5. Azure Functions: A serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. It\'s part of Microsoft\'s Azure cloud service.\n\n6. Event-Driven Architecture: An architectural pattern that orchestrates behavior around the production, detection and consumption of events.\n\n7. Google Cloud Functions: Google’s event-driven serverless compute platform which allows running your code with zero server management.\n\n8. OpenFaas: A framework for building serverless functions with Docker and Kubernetes which has first-class support for metrics.\n\n9. Warm Start: The execution of a function when the container is already set up, meaning the function starts quicker.\n\n10. Microservices: An architectural style that structures an application as a collection of services that can be developed, deployed, and scaled independently.\n\n11. Serverless Framework: An open-source development tool for building serverless applications. It provides a simplified deployment and testing experience across different cloud providers.\n\n12. Execution Model: A way in which a serverless function is run or executed. It defines how a function is triggered and how it can handle multiple requests.\n\n13. Stateless function: A function that does not retain memory about past executions and can handle each request independently.\n\n14. Scalability: The capability of a system, process, or a network to grow and manage increased demand. In serverless, scalability is often automatically managed by the cloud provider.\n\n15. CloudWatch: A monitoring service built for developers, system operators, site reliability engineers (SRE), and IT managers by AWS. It provides data and actionable insights to monitor applications, understand and respond to system-wide performance changes. \n\n16. Trigger: A mechanism which initiates a serverless function. This is often an HTTP request, a database update, a change in system state, etc. \n\n17. API Gateway: A serverless service allowing developers to create, publish, maintain, monitor, and secure APIs at any scale that acts as a "front door" for applications to access data, business logic, or functionality from your backend services.',
    role: 'assistant',
  },
  {
    content: 'Give me a table of HTTP Error Codes, Error Names, and brief descriptions',
    role: 'user',
    id: 'rHCxGZv',
  },
  {
    id: 'f7KMb8f',
    content:
      'Here is a list of some commonly used HTTP status codes, along with their official names and brief descriptions:\n\n| Status Code  | Reason Phrase                |      Description                                  |\n|--------------|------------------------------|---------------------------------------------------|\n| 200          | OK                           |The request has succeeded.                         |\n| 201          | Created                      |The request has been fulfilled and resulted in a new resource being created.|\n| 202          | Accepted                     |The request has been accepted for processing, but the processing has not been completed.|\n| 204          | No Content                   |The server has fulfilled the request, but does not need to return an entity-body.|\n| 301          | Moved Permanently            |The requested resource has been assigned a new permanent URI.|\n| 302          | Found                        |The requested resource resides temporarily under a different URI.|\n| 400          | Bad Request                  |The request could not be understood by the server.|\n| 401          | Unauthorized                 |The request requires user authentication.|\n| 403          | Forbidden                    |The server understood the request, but is refusing to fulfill it.|\n| 404          | Not Found                    |The server has not found anything matching the Request-URI.|\n| 405          | Method Not Allowed           |The method specified in the Request-Line is not allowed for the resource identified by the Request-URI.|\n| 500          | Internal Server Error        |The server encountered an unexpected condition and cannot fulfill the request.|\n| 503          | Service Unavailable          |The server is currently unable to handle the request due to a temporary overloading or maintenance.|',
    role: 'assistant',
  },
  {
    content: 'Give me a typescript function for converting ChatML format messages to Alpaca format',
    role: 'user',
    id: 'uHZj3ze',
  },
  {
    id: 'vlGMDj7',
    content:
      'Here\'s a TypeScript function to convert a hypothetical ChatML format to an Alpaca format. Please note, since the specifics of the ChatML and Alpaca formats aren\'t provided, this function is based on some assumptions made about the formats.\n\nIt\'s assumed that:\n- ChatML format is `{username: string, message: string, timestamp: string}`\n- Alpaca format is `{name: string, text: string, time: string}`\n- Timestamp is present in the same string format in both formats.\n\n```typescript\ntype ChatMLMessage = {\n  username: string;\n  message: string;\n  timestamp: string;\n};\n\ntype AlpacaMessage = {\n  name: string;\n  text: string;\n  time: string;\n};\n\nfunction convertChatMLtoAlpaca(chatML: ChatMLMessage): AlpacaMessage {\n  return {\n    name: chatML.username,\n    text: chatML.message,\n    time: chatML.timestamp,\n  };\n}\n```\n\nYou can call this function with a ChatML message object, and it will return an Alpaca message object:\n\n```typescript\nlet chatMLMessage: ChatMLMessage = {username: "User1", message: "Hi", timestamp: "2022-01-01T12:00:00Z"};\n\nlet alpacaMessage = convertChatMLtoAlpaca(chatMLMessage);\n\nconsole.log(alpacaMessage); // {name: "User1", text: "Hi", time: "2022-01-01T12:00:00Z"}\n```\n\nPlease replace with the correct specifications of ChatML and Alpaca formats if they differ from the assumptions made here.',
    role: 'assistant',
  },
  {
    content: 'Explain how Server Side Rendering works',
    role: 'user',
    id: 'bzbmLGf',
  },
  {
    id: '8cPZlQs',
    content:
      'Server Side Rendering (SSR) is a popular technique for rendering a client-side single page application (SPA) on the server and then sending a fully rendered page to the client. \n\nHere is a step by step explanation of how it works:\n\n1. **Request**: The process starts with the client (like a web browser) making a request to the server for a particular URL.\n\n2. **Server Rendering**: Instead of just sending an index.html file back to the client, the server executes the logic of the application using the URL as initial input. \n\n3. **Creation of HTML Page**: During the rendering on the server, your app makes API calls to fetch the necessary data and uses this data with the initial application code to render the complete HTML of the page on the server.\n\n4. **Response**: The server then sends this pre-rendered HTML response to the request back to the client.\n\n5. **Loading HTML and Static Assets**: The client receives the HTML and displays the page to the user while also loading any linked JavaScript files in the background.  \n\n6. **Rehydration**: Once the JS files load, they run and "hydrate" the HTML, attaching event handlers and adding interactivity to the page. From here, the SPA takes over and the page doesn\'t need to be refreshed completely to reflect changes. Instead, any updates are handled through the SPA updating the DOM as needed.\n\nBenefits of SSR include:\n\n- **Improved performance**: The user can see a fully rendered page faster, leading to perceived performance benefits.\n  \n- **SEO optimization**: SSR significantly improves SEO as search engine crawlers can directly see the fully rendered page. Some crawlers may not correctly render and index client-side JavaScript applications. \n\n- **Social media optimization (SMO)**: Social media platforms and services that use Open Graph tags can correctly scrape SSR web applications for previews. \n\nPlease note that the exact process could depend on technologies involved - JavaScript frameworks like React, Vue, Next.js etc., all have ways to handle SSR, but the underlying principle remains the same.',
    role: 'assistant',
  },
  {
    content: 'Explain rehydration errors in React',
    role: 'user',
    id: 'oUKgF3t',
  },
  {
    id: 'XXUa2OS',
    content:
      'Rehydration in the context of React refers to a process where the JavaScript sent from your server is put to work (or "rehydrated") on top of the HTML markup that the server rendered. This occurs when using Server Side Rendering (SSR).\n\nAn initial server-rendered HTML will be inert and won\'t handle user interactions. For it to become interactive (similar to a single-page-app), React "revives" the HTML using ReactDOM.hydrate(). At this point, the React code takes over and your site reacts to state changes and user events.\n\nA rehydration error occurs when the HTML markup generated on the server from the render() method doesn’t match with what the render() method generates on the client-side during rehydration.\n\nThis mismatch confuses React during the "diffing" process, where it compares the server-rendered app version to the virtual DOM version. Since the two versions are inconsistent, React can\'t efficiently handle updates, which might cause user interface (UI) problems.\n\nFor instance, you might see errors similar to this one:\n\n```shell\nWarning: Text content did not match. Server: "Server Text" Client: "Client Text"\n```\n\nYou usually see messages like this when your server and client code has different paths of execution or when there\'s a difference in state calculations between the server and the client. \n\nTo avoid these types of errors, ensure that your server-rendered markup is as similar as possible to your client-side rendered markup, and avoid running any side-effects (like promises, timeouts, etc.) until after rehydration is complete. You can use the React lifecycle method componentDidMount() for this purpose since it only executes on the client.',
    role: 'assistant',
  },
] as const

export const sampleInput = [
  'List of every towel.',
  'List of every European country and capital.',
  'Give me a table of common HTTP error codes and meanings.',
  'Short history of Australia.',
  'Short history of Indonesia.',
  'How many clowns can fit in a single clown car?',
]
