import { CliConfig } from './config';
import {
  getWebpackCommonConfig,
  getWebpackDevConfigPartial,
  getWebpackProdConfigPartial,
  getWebpackMobileConfigPartial,
  getWebpackMobileProdConfigPartial
} from './';

const webpackMerge = require('webpack-merge');
const path = require('path');

export class NgCliWebpackConfig {
  // TODO: When webpack2 types are finished lets replace all these any types
  // so this is more maintainable in the future for devs
  public config: any;
  private webpackDevConfigPartial: any;
  private webpackProdConfigPartial: any;
  private webpackBaseConfig: any;
  private webpackMaterialConfig: any;
  private webpackMaterialE2EConfig: any;
  private webpackMobileConfigPartial: any;
  private webpackMobileProdConfigPartial: any;

  constructor(public ngCliProject: any, public environment: string) {
    this.webpackBaseConfig = getWebpackCommonConfig(this.ngCliProject.root);
    this.webpackDevConfigPartial = getWebpackDevConfigPartial(this.ngCliProject.root);
    this.webpackProdConfigPartial = getWebpackProdConfigPartial(this.ngCliProject.root);

    if (CliConfig.fromProject().apps[0].mobile){
      this.webpackMobileConfigPartial = getWebpackMobileConfigPartial(this.ngCliProject.root);
      this.webpackMobileProdConfigPartial = getWebpackMobileProdConfigPartial(this.ngCliProject.root);
      this.webpackBaseConfig = webpackMerge(this.webpackBaseConfig, this.webpackMobileConfigPartial);
      this.webpackProdConfigPartial = webpackMerge(this.webpackProdConfigPartial, this.webpackMobileProdConfigPartial);
    }

    this.generateConfig();
  }

  generateConfig(): void {
    switch (this.environment) {
      case "d":
      case "dev":
      case "development":
      case "develop":
        this.config = webpackMerge(this.webpackBaseConfig, this.webpackDevConfigPartial);
        break;

      case "p":
      case "prod":
      case "production":
        this.config = webpackMerge(this.webpackBaseConfig, this.webpackProdConfigPartial);
        break;

      default:
        //TODO: Not sure what to put here. We have a default env passed anyways.
        this.ngCliProject.ui.writeLine("Envrionment could not be determined while configuring your build system.", 3)
        break;
    }
  }
}

