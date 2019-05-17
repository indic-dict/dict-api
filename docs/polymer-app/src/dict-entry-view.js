/*This element is used to present a given dictionary definition nicely.*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-card/paper-card.js';
import './shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
export class DictEntryView extends PolymerElement {
  static get template() {
    return html`
    <!--See - we extend shared-styles.-->
    <style include="shared-styles">
      :host {
        display: block;

        padding: 10px;
      }
    </style>

    <paper-card heading="">
        <div class="card-content">
            [[locationSummary]]
        </div>
        <hr>
        <div class="card-content">
            <template is="dom-repeat" items="[[dictEntry.headwords]]">
                [[item.text]]
            </template>
        </div>
        <hr>
        <div class="card-content">
            [[dictEntry.entry.text]]
        </div>
    </paper-card>
`;
  }

  static get is() { return 'dict-entry-view'; }
  static get properties() {
    return {
        dictEntry: Object,

        // A human friendly summary of where this entry is from.
        locationSummary: {
            type: String,
            computed: 'getLocationSummary(dictEntry.location)'
        }
    };
  }

  // Used to compute locationSummary property based on changes to dictEntry property.
  getLocationSummary(locationObj) {
      var dictIdParts = locationObj.dictionaryId.split("__");
      return dictIdParts[dictIdParts.length - 1].replace(/.babylon.*/, "") + `:${locationObj.entryNumber}`;
  }
}

window.customElements.define(DictEntryView.is, DictEntryView);
