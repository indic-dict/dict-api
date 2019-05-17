/*This element is used to present a given dictionary definition location nicely. Only difference from dict-entry-view is in the shadow-dom in the template.*/
import { DictEntryView } from './dict-entry-view.js';

import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class DictEntryLink extends DictEntryView {
  static get template() {
    return html`
        <paper-card heading="">
            <div class="entry-location">
                [[locationSummary]]
            </div>
        </paper-card>
`;
  }

  static get is() { return 'dict-entry-link'; }
}

window.customElements.define(DictEntryLink.is, DictEntryLink);
