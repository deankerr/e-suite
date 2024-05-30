/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.12.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as bmodels from "../bmodels.js";
import type * as constants from "../constants.js";
import type * as endpoints_openai from "../endpoints/openai.js";
import type * as files_createImageFromUrl from "../files/createImageFromUrl.js";
import type * as files_optimizeImageFile from "../files/optimizeImageFile.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as images_actions from "../images/actions.js";
import type * as images_manage from "../images/manage.js";
import type * as inference_chatCompletion from "../inference/chatCompletion.js";
import type * as inference_textToImage from "../inference/textToImage.js";
import type * as inference_threadTitleCompletion from "../inference/threadTitleCompletion.js";
import type * as jobs_definitions from "../jobs/definitions.js";
import type * as jobs_runner from "../jobs/runner.js";
import type * as lib_openai from "../lib/openai.js";
import type * as lib_schemas from "../lib/schemas.js";
import type * as lib_sharp from "../lib/sharp.js";
import type * as providers_aws from "../providers/aws.js";
import type * as providers_clerk from "../providers/clerk.js";
import type * as providers_fal_fast_animatediff from "../providers/fal/fast_animatediff.js";
import type * as providers_fal_fast_lightning_sdxl from "../providers/fal/fast_lightning_sdxl.js";
import type * as providers_fal_hyper_sdxl from "../providers/fal/hyper_sdxl.js";
import type * as providers_fal_illusion_diffusion from "../providers/fal/illusion_diffusion.js";
import type * as providers_fal_imageutils from "../providers/fal/imageutils.js";
import type * as providers_fal_lora from "../providers/fal/lora.js";
import type * as providers_fal_pixart_sigma from "../providers/fal/pixart_sigma.js";
import type * as providers_fal_types_animateDiffT2VInput from "../providers/fal/types/animateDiffT2VInput.js";
import type * as providers_fal_types_animateDiffT2VInputMotionsItem from "../providers/fal/types/animateDiffT2VInputMotionsItem.js";
import type * as providers_fal_types_animateDiffT2VInputVideoSize from "../providers/fal/types/animateDiffT2VInputVideoSize.js";
import type * as providers_fal_types_animateDiffT2VOutput from "../providers/fal/types/animateDiffT2VOutput.js";
import type * as providers_fal_types_animateDiffT2VTurboInput from "../providers/fal/types/animateDiffT2VTurboInput.js";
import type * as providers_fal_types_animateDiffT2VTurboInputMotionsItem from "../providers/fal/types/animateDiffT2VTurboInputMotionsItem.js";
import type * as providers_fal_types_animateDiffT2VTurboInputVideoSize from "../providers/fal/types/animateDiffT2VTurboInputVideoSize.js";
import type * as providers_fal_types_animateDiffV2VInput from "../providers/fal/types/animateDiffV2VInput.js";
import type * as providers_fal_types_animateDiffV2VInputMotionsItem from "../providers/fal/types/animateDiffV2VInputMotionsItem.js";
import type * as providers_fal_types_animateDiffV2VOutput from "../providers/fal/types/animateDiffV2VOutput.js";
import type * as providers_fal_types_animateDiffV2VTurboInput from "../providers/fal/types/animateDiffV2VTurboInput.js";
import type * as providers_fal_types_animateDiffV2VTurboInputMotionsItem from "../providers/fal/types/animateDiffV2VTurboInputMotionsItem.js";
import type * as providers_fal_types_controlNet from "../providers/fal/types/controlNet.js";
import type * as providers_fal_types_depthMapInput from "../providers/fal/types/depthMapInput.js";
import type * as providers_fal_types_depthMapOutput from "../providers/fal/types/depthMapOutput.js";
import type * as providers_fal_types_embedding from "../providers/fal/types/embedding.js";
import type * as providers_fal_types_file from "../providers/fal/types/file.js";
import type * as providers_fal_types_hTTPValidationError from "../providers/fal/types/hTTPValidationError.js";
import type * as providers_fal_types_iPAdapter from "../providers/fal/types/iPAdapter.js";
import type * as providers_fal_types_illusionDiffusionInput from "../providers/fal/types/illusionDiffusionInput.js";
import type * as providers_fal_types_illusionDiffusionInputImageSize from "../providers/fal/types/illusionDiffusionInputImageSize.js";
import type * as providers_fal_types_illusionDiffusionInputScheduler from "../providers/fal/types/illusionDiffusionInputScheduler.js";
import type * as providers_fal_types_illusionDiffusionOutput from "../providers/fal/types/illusionDiffusionOutput.js";
import type * as providers_fal_types_image from "../providers/fal/types/image.js";
import type * as providers_fal_types_imageSize from "../providers/fal/types/imageSize.js";
import type * as providers_fal_types_imageToImageHyperInput from "../providers/fal/types/imageToImageHyperInput.js";
import type * as providers_fal_types_imageToImageHyperInputFormat from "../providers/fal/types/imageToImageHyperInputFormat.js";
import type * as providers_fal_types_imageToImageHyperInputImageSize from "../providers/fal/types/imageToImageHyperInputImageSize.js";
import type * as providers_fal_types_imageToImageHyperInputNumInferenceSteps from "../providers/fal/types/imageToImageHyperInputNumInferenceSteps.js";
import type * as providers_fal_types_imageToImageInput from "../providers/fal/types/imageToImageInput.js";
import type * as providers_fal_types_imageToImageInputImageFormat from "../providers/fal/types/imageToImageInputImageFormat.js";
import type * as providers_fal_types_imageToImageInputModelArchitecture from "../providers/fal/types/imageToImageInputModelArchitecture.js";
import type * as providers_fal_types_imageToImageInputScheduler from "../providers/fal/types/imageToImageInputScheduler.js";
import type * as providers_fal_types_imageToImageLightningInput from "../providers/fal/types/imageToImageLightningInput.js";
import type * as providers_fal_types_imageToImageLightningInputFormat from "../providers/fal/types/imageToImageLightningInputFormat.js";
import type * as providers_fal_types_imageToImageLightningInputImageSize from "../providers/fal/types/imageToImageLightningInputImageSize.js";
import type * as providers_fal_types_imageToImageLightningInputNumInferenceSteps from "../providers/fal/types/imageToImageLightningInputNumInferenceSteps.js";
import type * as providers_fal_types_inpaintingHyperInput from "../providers/fal/types/inpaintingHyperInput.js";
import type * as providers_fal_types_inpaintingHyperInputFormat from "../providers/fal/types/inpaintingHyperInputFormat.js";
import type * as providers_fal_types_inpaintingHyperInputImageSize from "../providers/fal/types/inpaintingHyperInputImageSize.js";
import type * as providers_fal_types_inpaintingHyperInputNumInferenceSteps from "../providers/fal/types/inpaintingHyperInputNumInferenceSteps.js";
import type * as providers_fal_types_inpaintingLightningInput from "../providers/fal/types/inpaintingLightningInput.js";
import type * as providers_fal_types_inpaintingLightningInputFormat from "../providers/fal/types/inpaintingLightningInputFormat.js";
import type * as providers_fal_types_inpaintingLightningInputImageSize from "../providers/fal/types/inpaintingLightningInputImageSize.js";
import type * as providers_fal_types_inpaintingLightningInputNumInferenceSteps from "../providers/fal/types/inpaintingLightningInputNumInferenceSteps.js";
import type * as providers_fal_types_loraWeight from "../providers/fal/types/loraWeight.js";
import type * as providers_fal_types_marigoldDepthMapInput from "../providers/fal/types/marigoldDepthMapInput.js";
import type * as providers_fal_types_marigoldDepthMapOutput from "../providers/fal/types/marigoldDepthMapOutput.js";
import type * as providers_fal_types_nSFWImageDetectionInput from "../providers/fal/types/nSFWImageDetectionInput.js";
import type * as providers_fal_types_nSFWImageDetectionOutput from "../providers/fal/types/nSFWImageDetectionOutput.js";
import type * as providers_fal_types_output from "../providers/fal/types/output.js";
import type * as providers_fal_types_outputParameters from "../providers/fal/types/outputParameters.js";
import type * as providers_fal_types_outputTimings from "../providers/fal/types/outputTimings.js";
import type * as providers_fal_types_pixArtSigmaInput from "../providers/fal/types/pixArtSigmaInput.js";
import type * as providers_fal_types_pixArtSigmaInputImageSize from "../providers/fal/types/pixArtSigmaInputImageSize.js";
import type * as providers_fal_types_pixArtSigmaInputScheduler from "../providers/fal/types/pixArtSigmaInputScheduler.js";
import type * as providers_fal_types_pixArtSigmaInputStyle from "../providers/fal/types/pixArtSigmaInputStyle.js";
import type * as providers_fal_types_pixArtSigmaOutput from "../providers/fal/types/pixArtSigmaOutput.js";
import type * as providers_fal_types_pixArtSigmaOutputTimings from "../providers/fal/types/pixArtSigmaOutputTimings.js";
import type * as providers_fal_types_removeBackgroundInput from "../providers/fal/types/removeBackgroundInput.js";
import type * as providers_fal_types_removeBackgroundOutput from "../providers/fal/types/removeBackgroundOutput.js";
import type * as providers_fal_types_samInput from "../providers/fal/types/samInput.js";
import type * as providers_fal_types_samOutput from "../providers/fal/types/samOutput.js";
import type * as providers_fal_types_textToImageHyperInput from "../providers/fal/types/textToImageHyperInput.js";
import type * as providers_fal_types_textToImageHyperInputFormat from "../providers/fal/types/textToImageHyperInputFormat.js";
import type * as providers_fal_types_textToImageHyperInputImageSize from "../providers/fal/types/textToImageHyperInputImageSize.js";
import type * as providers_fal_types_textToImageHyperInputNumInferenceSteps from "../providers/fal/types/textToImageHyperInputNumInferenceSteps.js";
import type * as providers_fal_types_textToImageInput from "../providers/fal/types/textToImageInput.js";
import type * as providers_fal_types_textToImageInputImageFormat from "../providers/fal/types/textToImageInputImageFormat.js";
import type * as providers_fal_types_textToImageInputImageSize from "../providers/fal/types/textToImageInputImageSize.js";
import type * as providers_fal_types_textToImageInputModelArchitecture from "../providers/fal/types/textToImageInputModelArchitecture.js";
import type * as providers_fal_types_textToImageInputScheduler from "../providers/fal/types/textToImageInputScheduler.js";
import type * as providers_fal_types_textToImageLightningInput from "../providers/fal/types/textToImageLightningInput.js";
import type * as providers_fal_types_textToImageLightningInputFormat from "../providers/fal/types/textToImageLightningInputFormat.js";
import type * as providers_fal_types_textToImageLightningInputImageSize from "../providers/fal/types/textToImageLightningInputImageSize.js";
import type * as providers_fal_types_textToImageLightningInputNumInferenceSteps from "../providers/fal/types/textToImageLightningInputNumInferenceSteps.js";
import type * as providers_fal_types_upscaleInput from "../providers/fal/types/upscaleInput.js";
import type * as providers_fal_types_upscaleInputModel from "../providers/fal/types/upscaleInputModel.js";
import type * as providers_fal_types_upscaleOutput from "../providers/fal/types/upscaleOutput.js";
import type * as providers_fal_types_validationError from "../providers/fal/types/validationError.js";
import type * as providers_fal_types_validationErrorLocItem from "../providers/fal/types/validationErrorLocItem.js";
import type * as providers_fal from "../providers/fal.js";
import type * as providers_openai from "../providers/openai.js";
import type * as providers_sinkin from "../providers/sinkin.js";
import type * as providers_types from "../providers/types.js";
import type * as rules from "../rules.js";
import type * as shared_defaults from "../shared/defaults.js";
import type * as shared_entities from "../shared/entities.js";
import type * as shared_models from "../shared/models.js";
import type * as shared_structures from "../shared/structures.js";
import type * as shared_utils from "../shared/utils.js";
import type * as threads_mutate from "../threads/mutate.js";
import type * as threads_query from "../threads/query.js";
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
  bmodels: typeof bmodels;
  constants: typeof constants;
  "endpoints/openai": typeof endpoints_openai;
  "files/createImageFromUrl": typeof files_createImageFromUrl;
  "files/optimizeImageFile": typeof files_optimizeImageFile;
  functions: typeof functions;
  http: typeof http;
  "images/actions": typeof images_actions;
  "images/manage": typeof images_manage;
  "inference/chatCompletion": typeof inference_chatCompletion;
  "inference/textToImage": typeof inference_textToImage;
  "inference/threadTitleCompletion": typeof inference_threadTitleCompletion;
  "jobs/definitions": typeof jobs_definitions;
  "jobs/runner": typeof jobs_runner;
  "lib/openai": typeof lib_openai;
  "lib/schemas": typeof lib_schemas;
  "lib/sharp": typeof lib_sharp;
  "providers/aws": typeof providers_aws;
  "providers/clerk": typeof providers_clerk;
  "providers/fal/fast_animatediff": typeof providers_fal_fast_animatediff;
  "providers/fal/fast_lightning_sdxl": typeof providers_fal_fast_lightning_sdxl;
  "providers/fal/hyper_sdxl": typeof providers_fal_hyper_sdxl;
  "providers/fal/illusion_diffusion": typeof providers_fal_illusion_diffusion;
  "providers/fal/imageutils": typeof providers_fal_imageutils;
  "providers/fal/lora": typeof providers_fal_lora;
  "providers/fal/pixart_sigma": typeof providers_fal_pixart_sigma;
  "providers/fal/types/animateDiffT2VInput": typeof providers_fal_types_animateDiffT2VInput;
  "providers/fal/types/animateDiffT2VInputMotionsItem": typeof providers_fal_types_animateDiffT2VInputMotionsItem;
  "providers/fal/types/animateDiffT2VInputVideoSize": typeof providers_fal_types_animateDiffT2VInputVideoSize;
  "providers/fal/types/animateDiffT2VOutput": typeof providers_fal_types_animateDiffT2VOutput;
  "providers/fal/types/animateDiffT2VTurboInput": typeof providers_fal_types_animateDiffT2VTurboInput;
  "providers/fal/types/animateDiffT2VTurboInputMotionsItem": typeof providers_fal_types_animateDiffT2VTurboInputMotionsItem;
  "providers/fal/types/animateDiffT2VTurboInputVideoSize": typeof providers_fal_types_animateDiffT2VTurboInputVideoSize;
  "providers/fal/types/animateDiffV2VInput": typeof providers_fal_types_animateDiffV2VInput;
  "providers/fal/types/animateDiffV2VInputMotionsItem": typeof providers_fal_types_animateDiffV2VInputMotionsItem;
  "providers/fal/types/animateDiffV2VOutput": typeof providers_fal_types_animateDiffV2VOutput;
  "providers/fal/types/animateDiffV2VTurboInput": typeof providers_fal_types_animateDiffV2VTurboInput;
  "providers/fal/types/animateDiffV2VTurboInputMotionsItem": typeof providers_fal_types_animateDiffV2VTurboInputMotionsItem;
  "providers/fal/types/controlNet": typeof providers_fal_types_controlNet;
  "providers/fal/types/depthMapInput": typeof providers_fal_types_depthMapInput;
  "providers/fal/types/depthMapOutput": typeof providers_fal_types_depthMapOutput;
  "providers/fal/types/embedding": typeof providers_fal_types_embedding;
  "providers/fal/types/file": typeof providers_fal_types_file;
  "providers/fal/types/hTTPValidationError": typeof providers_fal_types_hTTPValidationError;
  "providers/fal/types/iPAdapter": typeof providers_fal_types_iPAdapter;
  "providers/fal/types/illusionDiffusionInput": typeof providers_fal_types_illusionDiffusionInput;
  "providers/fal/types/illusionDiffusionInputImageSize": typeof providers_fal_types_illusionDiffusionInputImageSize;
  "providers/fal/types/illusionDiffusionInputScheduler": typeof providers_fal_types_illusionDiffusionInputScheduler;
  "providers/fal/types/illusionDiffusionOutput": typeof providers_fal_types_illusionDiffusionOutput;
  "providers/fal/types/image": typeof providers_fal_types_image;
  "providers/fal/types/imageSize": typeof providers_fal_types_imageSize;
  "providers/fal/types/imageToImageHyperInput": typeof providers_fal_types_imageToImageHyperInput;
  "providers/fal/types/imageToImageHyperInputFormat": typeof providers_fal_types_imageToImageHyperInputFormat;
  "providers/fal/types/imageToImageHyperInputImageSize": typeof providers_fal_types_imageToImageHyperInputImageSize;
  "providers/fal/types/imageToImageHyperInputNumInferenceSteps": typeof providers_fal_types_imageToImageHyperInputNumInferenceSteps;
  "providers/fal/types/imageToImageInput": typeof providers_fal_types_imageToImageInput;
  "providers/fal/types/imageToImageInputImageFormat": typeof providers_fal_types_imageToImageInputImageFormat;
  "providers/fal/types/imageToImageInputModelArchitecture": typeof providers_fal_types_imageToImageInputModelArchitecture;
  "providers/fal/types/imageToImageInputScheduler": typeof providers_fal_types_imageToImageInputScheduler;
  "providers/fal/types/imageToImageLightningInput": typeof providers_fal_types_imageToImageLightningInput;
  "providers/fal/types/imageToImageLightningInputFormat": typeof providers_fal_types_imageToImageLightningInputFormat;
  "providers/fal/types/imageToImageLightningInputImageSize": typeof providers_fal_types_imageToImageLightningInputImageSize;
  "providers/fal/types/imageToImageLightningInputNumInferenceSteps": typeof providers_fal_types_imageToImageLightningInputNumInferenceSteps;
  "providers/fal/types/inpaintingHyperInput": typeof providers_fal_types_inpaintingHyperInput;
  "providers/fal/types/inpaintingHyperInputFormat": typeof providers_fal_types_inpaintingHyperInputFormat;
  "providers/fal/types/inpaintingHyperInputImageSize": typeof providers_fal_types_inpaintingHyperInputImageSize;
  "providers/fal/types/inpaintingHyperInputNumInferenceSteps": typeof providers_fal_types_inpaintingHyperInputNumInferenceSteps;
  "providers/fal/types/inpaintingLightningInput": typeof providers_fal_types_inpaintingLightningInput;
  "providers/fal/types/inpaintingLightningInputFormat": typeof providers_fal_types_inpaintingLightningInputFormat;
  "providers/fal/types/inpaintingLightningInputImageSize": typeof providers_fal_types_inpaintingLightningInputImageSize;
  "providers/fal/types/inpaintingLightningInputNumInferenceSteps": typeof providers_fal_types_inpaintingLightningInputNumInferenceSteps;
  "providers/fal/types/loraWeight": typeof providers_fal_types_loraWeight;
  "providers/fal/types/marigoldDepthMapInput": typeof providers_fal_types_marigoldDepthMapInput;
  "providers/fal/types/marigoldDepthMapOutput": typeof providers_fal_types_marigoldDepthMapOutput;
  "providers/fal/types/nSFWImageDetectionInput": typeof providers_fal_types_nSFWImageDetectionInput;
  "providers/fal/types/nSFWImageDetectionOutput": typeof providers_fal_types_nSFWImageDetectionOutput;
  "providers/fal/types/output": typeof providers_fal_types_output;
  "providers/fal/types/outputParameters": typeof providers_fal_types_outputParameters;
  "providers/fal/types/outputTimings": typeof providers_fal_types_outputTimings;
  "providers/fal/types/pixArtSigmaInput": typeof providers_fal_types_pixArtSigmaInput;
  "providers/fal/types/pixArtSigmaInputImageSize": typeof providers_fal_types_pixArtSigmaInputImageSize;
  "providers/fal/types/pixArtSigmaInputScheduler": typeof providers_fal_types_pixArtSigmaInputScheduler;
  "providers/fal/types/pixArtSigmaInputStyle": typeof providers_fal_types_pixArtSigmaInputStyle;
  "providers/fal/types/pixArtSigmaOutput": typeof providers_fal_types_pixArtSigmaOutput;
  "providers/fal/types/pixArtSigmaOutputTimings": typeof providers_fal_types_pixArtSigmaOutputTimings;
  "providers/fal/types/removeBackgroundInput": typeof providers_fal_types_removeBackgroundInput;
  "providers/fal/types/removeBackgroundOutput": typeof providers_fal_types_removeBackgroundOutput;
  "providers/fal/types/samInput": typeof providers_fal_types_samInput;
  "providers/fal/types/samOutput": typeof providers_fal_types_samOutput;
  "providers/fal/types/textToImageHyperInput": typeof providers_fal_types_textToImageHyperInput;
  "providers/fal/types/textToImageHyperInputFormat": typeof providers_fal_types_textToImageHyperInputFormat;
  "providers/fal/types/textToImageHyperInputImageSize": typeof providers_fal_types_textToImageHyperInputImageSize;
  "providers/fal/types/textToImageHyperInputNumInferenceSteps": typeof providers_fal_types_textToImageHyperInputNumInferenceSteps;
  "providers/fal/types/textToImageInput": typeof providers_fal_types_textToImageInput;
  "providers/fal/types/textToImageInputImageFormat": typeof providers_fal_types_textToImageInputImageFormat;
  "providers/fal/types/textToImageInputImageSize": typeof providers_fal_types_textToImageInputImageSize;
  "providers/fal/types/textToImageInputModelArchitecture": typeof providers_fal_types_textToImageInputModelArchitecture;
  "providers/fal/types/textToImageInputScheduler": typeof providers_fal_types_textToImageInputScheduler;
  "providers/fal/types/textToImageLightningInput": typeof providers_fal_types_textToImageLightningInput;
  "providers/fal/types/textToImageLightningInputFormat": typeof providers_fal_types_textToImageLightningInputFormat;
  "providers/fal/types/textToImageLightningInputImageSize": typeof providers_fal_types_textToImageLightningInputImageSize;
  "providers/fal/types/textToImageLightningInputNumInferenceSteps": typeof providers_fal_types_textToImageLightningInputNumInferenceSteps;
  "providers/fal/types/upscaleInput": typeof providers_fal_types_upscaleInput;
  "providers/fal/types/upscaleInputModel": typeof providers_fal_types_upscaleInputModel;
  "providers/fal/types/upscaleOutput": typeof providers_fal_types_upscaleOutput;
  "providers/fal/types/validationError": typeof providers_fal_types_validationError;
  "providers/fal/types/validationErrorLocItem": typeof providers_fal_types_validationErrorLocItem;
  "providers/fal": typeof providers_fal;
  "providers/openai": typeof providers_openai;
  "providers/sinkin": typeof providers_sinkin;
  "providers/types": typeof providers_types;
  rules: typeof rules;
  "shared/defaults": typeof shared_defaults;
  "shared/entities": typeof shared_entities;
  "shared/models": typeof shared_models;
  "shared/structures": typeof shared_structures;
  "shared/utils": typeof shared_utils;
  "threads/mutate": typeof threads_mutate;
  "threads/query": typeof threads_query;
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
