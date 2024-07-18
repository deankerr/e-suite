import AwsVoicesJson from './aws.voices.json'

export const getNormalizedVoiceModelData = () => {
  return AwsVoicesJson.filter((data) => data.LanguageCode.startsWith('en-')).map((data) => ({
    resourceKey: `aws::${data.Id}`,
    endpoint: 'aws',
    endpointModelId: data.Id,
    name: data.Name,
    creatorName: 'AWS Polly',
    accent: data.LanguageName,
    gender: data.Gender,
  }))
}
