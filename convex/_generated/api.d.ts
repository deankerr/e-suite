/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.14.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as crons from "../crons.js";
import type * as db_admin_events from "../db/admin/events.js";
import type * as db_admin_see from "../db/admin/see.js";
import type * as db_images from "../db/images.js";
import type * as db_messages from "../db/messages.js";
import type * as db_models from "../db/models.js";
import type * as db_threads from "../db/threads.js";
import type * as db_users from "../db/users.js";
import type * as deletion from "../deletion.js";
import type * as endpoints_aws from "../endpoints/aws.js";
import type * as endpoints_aws_node from "../endpoints/aws_node.js";
import type * as endpoints_elevenlabs from "../endpoints/elevenlabs.js";
import type * as endpoints_fal from "../endpoints/fal.js";
import type * as endpoints_openai from "../endpoints/openai.js";
import type * as endpoints_openrouter from "../endpoints/openrouter.js";
import type * as endpoints_sinkin from "../endpoints/sinkin.js";
import type * as endpoints_together from "../endpoints/together.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
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
import type * as shared_utils from "../shared/utils.js";
import type * as types from "../types.js";
import type * as users from "../users.js";
import type * as workflows_actions_classifyImageContent from "../workflows/actions/classifyImageContent.js";
import type * as workflows_actions_evaluateNsfwProbability from "../workflows/actions/evaluateNsfwProbability.js";
import type * as workflows_actions_generateImageCaption from "../workflows/actions/generateImageCaption.js";
import type * as workflows_actions_textToImage_fal from "../workflows/actions/textToImage/fal.js";
import type * as workflows_actions_textToImage_sinkin from "../workflows/actions/textToImage/sinkin.js";
import type * as workflows_engine from "../workflows/engine.js";
import type * as workflows_helpers from "../workflows/helpers.js";
import type * as workflows_jobs from "../workflows/jobs.js";
import type * as workflows_pipelines_chat from "../workflows/pipelines/chat.js";
import type * as workflows_pipelines_evaluateMessageUrls from "../workflows/pipelines/evaluateMessageUrls.js";
import type * as workflows_pipelines_generateThreadTitle from "../workflows/pipelines/generateThreadTitle.js";
import type * as workflows_pipelines_ingestImageUrl from "../workflows/pipelines/ingestImageUrl.js";
import type * as workflows_pipelines_textToAudio from "../workflows/pipelines/textToAudio.js";
import type * as workflows_pipelines_textToImage from "../workflows/pipelines/textToImage.js";
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
  crons: typeof crons;
  "db/admin/events": typeof db_admin_events;
  "db/admin/see": typeof db_admin_see;
  "db/images": typeof db_images;
  "db/messages": typeof db_messages;
  "db/models": typeof db_models;
  "db/threads": typeof db_threads;
  "db/users": typeof db_users;
  deletion: typeof deletion;
  "endpoints/aws": typeof endpoints_aws;
  "endpoints/aws_node": typeof endpoints_aws_node;
  "endpoints/elevenlabs": typeof endpoints_elevenlabs;
  "endpoints/fal": typeof endpoints_fal;
  "endpoints/openai": typeof endpoints_openai;
  "endpoints/openrouter": typeof endpoints_openrouter;
  "endpoints/sinkin": typeof endpoints_sinkin;
  "endpoints/together": typeof endpoints_together;
  functions: typeof functions;
  http: typeof http;
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
  "shared/utils": typeof shared_utils;
  types: typeof types;
  users: typeof users;
  "workflows/actions/classifyImageContent": typeof workflows_actions_classifyImageContent;
  "workflows/actions/evaluateNsfwProbability": typeof workflows_actions_evaluateNsfwProbability;
  "workflows/actions/generateImageCaption": typeof workflows_actions_generateImageCaption;
  "workflows/actions/textToImage/fal": typeof workflows_actions_textToImage_fal;
  "workflows/actions/textToImage/sinkin": typeof workflows_actions_textToImage_sinkin;
  "workflows/engine": typeof workflows_engine;
  "workflows/helpers": typeof workflows_helpers;
  "workflows/jobs": typeof workflows_jobs;
  "workflows/pipelines/chat": typeof workflows_pipelines_chat;
  "workflows/pipelines/evaluateMessageUrls": typeof workflows_pipelines_evaluateMessageUrls;
  "workflows/pipelines/generateThreadTitle": typeof workflows_pipelines_generateThreadTitle;
  "workflows/pipelines/ingestImageUrl": typeof workflows_pipelines_ingestImageUrl;
  "workflows/pipelines/textToAudio": typeof workflows_pipelines_textToAudio;
  "workflows/pipelines/textToImage": typeof workflows_pipelines_textToImage;
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
