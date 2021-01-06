import map from 'lodash/map';
import forEach from 'lodash/forEach';
import { SelfDescribingJson } from '@snowplow/tracker-core';
import { parseAndValidateInt } from '@snowplow/browser-helpers';
import { OptimizelyxSummary } from './contexts';

declare global {
  interface Window {
    optimizely: {
      get: (property: string) => { [key: string]: any };
    };
  }
}

const OptimizelyXPlugin = () => {
  const windowAlias = window;

  /**
   * Check that *both* optimizely and optimizely.get exist
   *
   * @param property optimizely data property
   * @param snd optional nested property
   */
  function getOptimizelyXData(property: string, snd?: string) {
    var data;
    if (windowAlias.optimizely && typeof windowAlias.optimizely.get === 'function') {
      data = windowAlias.optimizely.get(property);
      if (typeof snd !== 'undefined' && data !== undefined) {
        data = data[snd];
      }
    }
    return data;
  }

  /**
   * Get data for OptimizelyX contexts - active experiments on current page
   *
   * @returns Array content of lite optimizely lite context
   */
  function getOptimizelyXSummary(): OptimizelyxSummary[] {
    var state = getOptimizelyXData('state');
    var experiment_ids = state && state.getActiveExperimentIds();
    var variationMap = state && state.getVariationMap();
    var visitor = getOptimizelyXData('visitor');

    return map(experiment_ids, function (activeExperiment) {
      var variation = variationMap[activeExperiment];
      var variationName = (variation && variation.name && variation.name.toString()) || null;
      var variationId = variation && variation.id;
      var visitorId = (visitor && visitor.visitorId && visitor.visitorId.toString()) || null;
      return {
        experimentId: parseAndValidateInt(activeExperiment) || null,
        variationName: variationName,
        variation: parseAndValidateInt(variationId) || null,
        visitorId: visitorId,
      };
    });
  }

  /**
   * Creates an OptimizelyX context containing only data required to join
   * event to experiment data
   *
   * @returns Array of custom contexts
   */
  function getOptimizelyXSummaryContexts() {
    return map(getOptimizelyXSummary(), function (experiment) {
      return {
        schema: 'iglu:com.optimizely.optimizelyx/summary/jsonschema/1-0-0',
        data: experiment,
      };
    });
  }

  return {
    getContexts: () => {
      const contexts: SelfDescribingJson[] = [];

      // Add Optimizely Contexts
      if (windowAlias.optimizely) {
        var activeXExperiments = getOptimizelyXSummaryContexts();
        forEach(activeXExperiments, function (e) {
          contexts.push(e);
        });
      }

      return contexts;
    },
  };
};

export { OptimizelyXPlugin };
