import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';
import { OptimizelyPlugin } from '@snowplow/browser-plugin-optimizely';
import { OptimizelyXPlugin } from '@snowplow/browser-plugin-optimizely-x';
import { ParrablePlugin } from '@snowplow/browser-plugin-parrable';
import { PerformanceTimingPlugin } from '@snowplow/browser-plugin-performance-timing';
import pluginConfig from '../../plugins.config';

export function Plugins(argmap) {
  const plugins = [];
  const {
    contexts: {
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
    },
  } = argmap;

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

  if (pluginConfig.performanceTiming && performanceTiming) {
    plugins.push(PerformanceTimingPlugin());
  }

  if (pluginConfig.optimizelyX && optimizelyXSummary) {
    plugins.push(OptimizelyXPlugin());
  }

  if (pluginConfig.clientHints && clientHints) {
    plugins.push(ClientHintsPlugin(clientHints.includeHighEntropy ? true : false));
  }

  if (pluginConfig.parrable && parrable) {
    plugins.push(ParrablePlugin());
  }

  return plugins;
}
