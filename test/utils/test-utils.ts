export enum AwsResourceType {
  APPSYNC_API = 'AWS::AppSync::GraphQLApi',
  APPSYNC_DATASOURCE = 'AWS::AppSync::DataSource',
  APPSYNC_RESOLVER = 'AWS::AppSync::Resolver',
  DYNAMODB = 'AWS::DynamoDB::Table',
  LAMBDA_FUNCTION = 'AWS::Lambda::Function',
  S3_BUCKET = 'AWS::S3::Bucket',
  SQS_QUEUE = 'AWS::SQS::Queue',
}