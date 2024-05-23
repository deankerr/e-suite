type JobDefinition = {
  handler: string
  required: Record<string, boolean>
}

export type JobNames = keyof typeof jobDefinitions

export const jobDefinitions = {
  'files/create-image-from-url': {
    handler: 'internal.files.createImageFromUrl.run',
    required: {
      url: true,
      messageId: true,
    },
  },

  'files/optimize-image-file': {
    handler: 'internal.files.optimizeImageFile.run',
    required: {
      imageId: true,
    },
  },

  'inference/chat-completion': {
    handler: 'internal.inference.chatCompletion.run',
    required: {
      messageId: true,
    },
  },

  'inference/chat-completion-stream': {
    handler: 'internal.inference.chatCompletionStream.run',
    required: {
      messageId: true,
    },
  },

  'inference/text-to-image': {
    handler: 'internal.inference.textToImage.run',
    required: {
      messageId: true,
    },
  },

  'inference/thread-title-completion': {
    handler: 'internal.inference.threadTitleCompletion.run',
    required: {
      threadId: true,
    },
  },
} satisfies Record<string, JobDefinition>
