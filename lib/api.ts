import {
  App,
  Stack,
  StackProps,
} from 'aws-cdk-lib';

export interface ApiStackProps extends StackProps {
  readonly disambiguator: string;
}

export class ApiStack extends Stack {
  readonly props: ApiStackProps;

  constructor(scope: App, id: string, props: ApiStackProps) {
    super(scope, id, props);
    this.props = props;
  }
}