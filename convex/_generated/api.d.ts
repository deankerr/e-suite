/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.13.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as db_admin_see from "../db/admin/see.js";
import type * as db_chatModels from "../db/chatModels.js";
import type * as db_endpoints from "../db/endpoints.js";
import type * as db_imageModels from "../db/imageModels.js";
import type * as db_images from "../db/images.js";
import type * as db_messages from "../db/messages.js";
import type * as db_models from "../db/models.js";
import type * as db_speech from "../db/speech.js";
import type * as db_threads from "../db/threads.js";
import type * as db_voiceModels from "../db/voiceModels.js";
import type * as deletion from "../deletion.js";
import type * as endpoints_aws from "../endpoints/aws.js";
import type * as endpoints_aws_node from "../endpoints/aws_node.js";
import type * as endpoints_elevenlabs from "../endpoints/elevenlabs.js";
import type * as endpoints_fal from "../endpoints/fal.js";
import type * as endpoints_openai from "../endpoints/openai.js";
import type * as endpoints_openrouter from "../endpoints/openrouter.js";
import type * as endpoints_sinkin from "../endpoints/sinkin.js";
import type * as endpoints_together from "../endpoints/together.js";
import type * as files_ingestImageUrl from "../files/ingestImageUrl.js";
import type * as files_processUrlContent from "../files/processUrlContent.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as inference_assessNsfw from "../inference/assessNsfw.js";
import type * as inference_captionImage from "../inference/captionImage.js";
import type * as inference_chat from "../inference/chat.js";
import type * as inference_chatCompletionAi from "../inference/chatCompletionAi.js";
import type * as inference_textToAudio from "../inference/textToAudio.js";
import type * as inference_textToImage from "../inference/textToImage.js";
import type * as inference_textToSpeech from "../inference/textToSpeech.js";
import type * as inference_threadTitleCompletion from "../inference/threadTitleCompletion.js";
import type * as jobs from "../jobs.js";
import type * as lib_clerk from "../lib/clerk.js";
import type * as lib_fetch from "../lib/fetch.js";
import type * as lib_openai from "../lib/openai.js";
import type * as lib_paramInputs from "../lib/paramInputs.js";
import type * as lib_sharp from "../lib/sharp.js";
import type * as migrations from "../migrations.js";
import type * as rules from "../rules.js";
import type * as shared_defaults from "../shared/defaults.js";
import type * as shared_structures from "../shared/structures.js";
import type * as shared_utils from "../shared/utils.js";
import type * as types from "../types.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "db/admin/see": typeof db_admin_see;
  "db/chatModels": typeof db_chatModels;
  "db/endpoints": typeof db_endpoints;
  "db/imageModels": typeof db_imageModels;
  "db/images": typeof db_images;
  "db/messages": typeof db_messages;
  "db/models": typeof db_models;
  "db/speech": typeof db_speech;
  "db/threads": typeof db_threads;
  "db/voiceModels": typeof db_voiceModels;
  deletion: typeof deletion;
  "endpoints/aws": typeof endpoints_aws;
  "endpoints/aws_node": typeof endpoints_aws_node;
  "endpoints/elevenlabs": typeof endpoints_elevenlabs;
  "endpoints/fal": typeof endpoints_fal;
  "endpoints/openai": typeof endpoints_openai;
  "endpoints/openrouter": typeof endpoints_openrouter;
  "endpoints/sinkin": typeof endpoints_sinkin;
  "endpoints/together": typeof endpoints_together;
  "files/ingestImageUrl": typeof files_ingestImageUrl;
  "files/processUrlContent": typeof files_processUrlContent;
  functions: typeof functions;
  http: typeof http;
  "inference/assessNsfw": typeof inference_assessNsfw;
  "inference/captionImage": typeof inference_captionImage;
  "inference/chat": typeof inference_chat;
  "inference/chatCompletionAi": typeof inference_chatCompletionAi;
  "inference/textToAudio": typeof inference_textToAudio;
  "inference/textToImage": typeof inference_textToImage;
  "inference/textToSpeech": typeof inference_textToSpeech;
  "inference/threadTitleCompletion": typeof inference_threadTitleCompletion;
  jobs: typeof jobs;
  "lib/clerk": typeof lib_clerk;
  "lib/fetch": typeof lib_fetch;
  "lib/openai": typeof lib_openai;
  "lib/paramInputs": typeof lib_paramInputs;
  "lib/sharp": typeof lib_sharp;
  migrations: typeof migrations;
  rules: typeof rules;
  "shared/defaults": typeof shared_defaults;
  "shared/structures": typeof shared_structures;
  "shared/utils": typeof shared_utils;
  types: typeof types;
  users: typeof users;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
