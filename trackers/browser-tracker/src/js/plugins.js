import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';
import { OptimizelyPlugin } from '@snowplow/browser-plugin-optimizely';
import { OptimizelyXPlugin } from '@snowplow/browser-plugin-optimizely-x';
import pluginConfig from '../../plugins.config';

export function plugins(argmap) {
  const plugins = [];
  const { contexts } = argmap;
  const {
    performanceTiming,
    gaCookies,
    geolocation,
    optimizelyExperiments,
    optimizelyStates,
    optimizelyVariations,
    optimizelyVisitor,
    optimizelyAudiences,
    optimizelyDimensions,
    optimizelySummary,
    optimizelyXSummary,
    parrable,
    clientHints,
  } = contexts;

  // contexts: {
  //     webPage: true,
  //     performanceTiming: true,
  //     gaCookies: true,
  //     geolocation: false,
  //     optimizelyExperiments: true,
  //     optimizelyStates: true,
  //     optimizelyVariations: true,
  //     optimizelyVisitor: true,
  //     optimizelyAudiences: true,
  //     optimizelyDimensions: true,
  //     optimizelySummary: true,
  //     optimizelyXSummary: true,
  //     parrable: true
  //     clientHints: true, // Available from 2.15.0
  //     // clientHints: { includeHighEntropy: true } // Optional
  //   }
  if (pluginConfig.optimizely) {
    plugins.push(
      OptimizelyPlugin(
        optimizelySummary,
        optimizelyExperiments,
        optimizelyStates,
        optimizelyVariations,
        optimizelyVisitor,
        optimizelyAudiences,
        optimizelyDimensions
      )
    );
  }

  if (pluginConfig.optimizelyX && optimizelyXSummary) {
    plugins.push(OptimizelyXPlugin());
  }

  if (pluginConfig.clientHints && clientHints) {
    plugins.push(ClientHintsPlugin(clientHints.includeHighEntropy ? true : false));
  }

  return plugins;
}
