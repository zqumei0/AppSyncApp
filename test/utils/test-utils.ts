export enum AwsResourceType {
  DYNAMODB = 'AWS::DynamoDB::Table',
  LAMBDA_FUNCTION = 'AWS::Lambda::Function',
  APPSYNC_API = 'AWS::AppSync::GraphQLApi',
  APPSYNC_RESOLVER = 'AWS::AppSync::Resolver',
  S3_BUCKET = 'AWS::S3::Bucket',
  SQS_QUEUE = 'AWS::SQS::Queue',
}