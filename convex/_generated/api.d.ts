/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as action_chat from "../action/chat.js";
import type * as action_evaluateMessageUrls from "../action/evaluateMessageUrls.js";
import type * as action_evaluateNsfwProbability from "../action/evaluateNsfwProbability.js";
import type * as action_generate from "../action/generate.js";
import type * as action_generateImageVisionData from "../action/generateImageVisionData.js";
import type * as action_generateThreadTitle from "../action/generateThreadTitle.js";
import type * as action_ingestImageUrl from "../action/ingestImageUrl.js";
import type * as action_textToImage from "../action/textToImage.js";
import type * as crons from "../crons.js";
import type * as db_admin_events from "../db/admin/events.js";
import type * as db_admin_see from "../db/admin/see.js";
import type * as db_collections from "../db/collections.js";
import type * as db_generations from "../db/generations.js";
import type * as db_images from "../db/images.js";
import type * as db_jobs from "../db/jobs.js";
import type * as db_messages from "../db/messages.js";
import type * as db_models from "../db/models.js";
import type * as db_page from "../db/page.js";
import type * as db_threads from "../db/threads.js";
import type * as db_users from "../db/users.js";
import type * as deletion from "../deletion.js";
import type * as endpoints_aws from "../endpoints/aws.js";
import type * as endpoints_aws_node from "../endpoints/aws_node.js";
import type * as endpoints_elevenlabs from "../endpoints/elevenlabs.js";
import type * as endpoints_fal from "../endpoints/fal.js";
import type * as endpoints_openai from "../endpoints/openai.js";
import type * as endpoints_openrouter from "../endpoints/openrouter.js";
import type * as endpoints_together from "../endpoints/together.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as lib_ai from "../lib/ai.js";
import type * as lib_clerk from "../lib/clerk.js";
import type * as lib_env from "../lib/env.js";
import type * as lib_fetch from "../lib/fetch.js";
import type * as lib_modelTags from "../lib/modelTags.js";
import type * as lib_sharp from "../lib/sharp.js";
import type * as lib_utils from "../lib/utils.js";
import type * as lib_valibot from "../lib/valibot.js";
import type * as migrations from "../migrations.js";
import type * as rules from "../rules.js";
import type * as shared_defaults from "../shared/defaults.js";
import type * as shared_helpers from "../shared/helpers.js";
import type * as shared_imageModels from "../shared/imageModels.js";
import type * as shared_utils from "../shared/utils.js";
import type * as types from "../types.js";
import type * as users from "../users.js";
import type * as workflows_engine from "../workflows/engine.js";
import type * as workflows_helpers from "../workflows/helpers.js";
import type * as workflows_jobs from "../workflows/jobs.js";
import type * as workflows_pipelines_textToAudio from "../workflows/pipelines/textToAudio.js";
import type * as workflows_types from "../workflows/types.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "action/chat": typeof action_chat;
  "action/evaluateMessageUrls": typeof action_evaluateMessageUrls;
  "action/evaluateNsfwProbability": typeof action_evaluateNsfwProbability;
  "action/generate": typeof action_generate;
  "action/generateImageVisionData": typeof action_generateImageVisionData;
  "action/generateThreadTitle": typeof action_generateThreadTitle;
  "action/ingestImageUrl": typeof action_ingestImageUrl;
  "action/textToImage": typeof action_textToImage;
  crons: typeof crons;
  "db/admin/events": typeof db_admin_events;
  "db/admin/see": typeof db_admin_see;
  "db/collections": typeof db_collections;
  "db/generations": typeof db_generations;
  "db/images": typeof db_images;
  "db/jobs": typeof db_jobs;
  "db/messages": typeof db_messages;
  "db/models": typeof db_models;
  "db/page": typeof db_page;
  "db/threads": typeof db_threads;
  "db/users": typeof db_users;
  deletion: typeof deletion;
  "endpoints/aws": typeof endpoints_aws;
  "endpoints/aws_node": typeof endpoints_aws_node;
  "endpoints/elevenlabs": typeof endpoints_elevenlabs;
  "endpoints/fal": typeof endpoints_fal;
  "endpoints/openai": typeof endpoints_openai;
  "endpoints/openrouter": typeof endpoints_openrouter;
  "endpoints/together": typeof endpoints_together;
  functions: typeof functions;
  http: typeof http;
  "lib/ai": typeof lib_ai;
  "lib/clerk": typeof lib_clerk;
  "lib/env": typeof lib_env;
  "lib/fetch": typeof lib_fetch;
  "lib/modelTags": typeof lib_modelTags;
  "lib/sharp": typeof lib_sharp;
  "lib/utils": typeof lib_utils;
  "lib/valibot": typeof lib_valibot;
  migrations: typeof migrations;
  rules: typeof rules;
  "shared/defaults": typeof shared_defaults;
  "shared/helpers": typeof shared_helpers;
  "shared/imageModels": typeof shared_imageModels;
  "shared/utils": typeof shared_utils;
  types: typeof types;
  users: typeof users;
  "workflows/engine": typeof workflows_engine;
  "workflows/helpers": typeof workflows_helpers;
  "workflows/jobs": typeof workflows_jobs;
  "workflows/pipelines/textToAudio": typeof workflows_pipelines_textToAudio;
  "workflows/types": typeof workflows_types;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
