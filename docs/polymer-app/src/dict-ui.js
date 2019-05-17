/*We put the import statements at the top.*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

/**************UI Related imports*/
import '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
/*We're using the drawer layout, so: */
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
/*Main display area is composed of a header, so: */
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
/*We've got a combobox in the toolbar.*/
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
/********** Non UI imports*/
/*Used to query the dict api.*/
/*We display dict entries!*/
import './dict-entry-view.js';
import './dict-entry-link.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*We listen to dynamically added DOM nodes in this element, so:*/
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
class DictUi extends PolymerElement {
  static get template() {
    return html`
    <!--It is convention to place the style at the top. We don't seem to need "shared-style"s here.-->
    <style>
      :host {
        /*TOKNOW: I have no idea what :host is.*/

        /*This is the color used in the page header - see the app-header block below.*/
        --app-primary-color: #f4dc28;
        --app-secondary-color: black;
        display: block;
      }

      /*********************We use the drawer layout (see below). This is its style.*/
      app-drawer-layout:not([narrow]) [drawer-toggle] {
        /* Something to do with the drawer.
      TOKNOW: What is the not([narrow]) bit above?.*/
        display: none;
      }

      .drawer-list {
        margin: 0 20px;
      }

      /*This is what each item in the drawer to the left will look like.*/
      .drawer-list a {
        display: block;
        padding: 0 16px;
        text-decoration: none;
        color: var(--app-secondary-color);
        line-height: 40px;
      }

      /*This is what the selected item in the drawer to the left will look like.*/
      .drawer-list a.iron-selected {
        color: black;
        font-weight: bold;
      }

      /*********************The main part of our app has a header. This is its style*/
      app-header {
        color: black;
        background-color: var(--app-primary-color);
      }
    </style>
    <app-drawer-layout fullbleed="">

      <!-- Drawer content
      Depending on the screen size, it will need to be "pulled out" by the user. Neat!
      * TODO: The drawer will eventually index the definitions we will show in the result, helping the user navigate.
      * TODO: There might also be a link to setting the user preferences and the like.
      * TODO: Drawer does no longer appears on smalls mobile screens (linked with making it contain a scrolling region?).
      -->
      <app-drawer id="drawer" slot="drawer" swipeopen="">
          <app-toolbar>Result index</app-toolbar>
          <div style="height: 100%; overflow: auto;">
            <template is="dom-repeat" items="[[dictEntries]]" id="dictEntryLinks">
              <!--Alternatively: Could use path array element in the event captured by on-click="_scrollToEntry".-->
              <dict-entry-link id="index__[[item._id]]" dict-entry="[[item]]" on-click="_scrollToEntry"></dict-entry-link>
            </template>
          </div>
        
      </app-drawer>

      <!-- Main content
      Now, here we have everything apart from the drawer. It has two parts:
      * the header,
      * and the content page.
      -->
      <app-header-layout>
        <app-header slot="header" condenses="" reveals="" effects="waterfall">
          <app-toolbar>
            <!--
            This is the search box!
            * The value typed by the user is bound to the query property, which is also used in the iron-ajax element which makes a REST API call to our dictionary database. {{}} means "bidrectional" binding, so that vaadin-combo-box and this component are in sync about the value of the query property.
            * The combo-box items are bound to the headwords variable. [[]] means that the binding is 1-way "host to target",
              where dict-ui is the host, and vaadin-combo-box is the "target".
            -->
            <!--More comments about how the headwords are populated are provided in the properties function.
            -->
            <vaadin-combo-box id="queryBox" label="Query" filter="{{query}}" filtered-items="[[headwords]]" on-filter-changed="_queryChanged" value="{{selectedHeadword}}" on-value-changed="_headwordSelectionHandler" loading="[[queryBoxWaiting]]"></vaadin-combo-box>

            <!--Iron AJAX! Here is where we get headwords starting with a given prefix.
            http://vedavaapi.org:5984/dict_entries/_design/index_headwords/_view/index_headwords?limit=20&reduce=true&inclusive_end=true&start_key=%22ast%22&group=true

            20170804- With params='{"start_key":"[[query]]", I ran into this problem: https://stackoverflow.com/questions/34164649/polymer-iron-ajax-element-params-with-databinding-is-splitting-the-parameter-int . Hence doing a workaround.

            Not using "auto" mostly to work around the above.
            -->
            <iron-ajax 
            id="headwordQueryApp" 
            url="https://api.vedavaapi.org/couchdb/dict_entries/_design/index_headwords/_view/index_headwords" 
            params="{&quot;start_key&quot;:&quot;[[query]]&quot;}" 
            loading="{{queryBoxWaiting}}" handle-as="json" 
            on-response="_handleHeadwordResponse" 
            debounce-duration="300"></iron-ajax>

            <!--This component looks up definitions for a given value (obtained from the combo-box.)
            Example: http://localhost:5984/dict_entries/_design/index_headwords/_view/index_headwords?reduce=false&include_docs=true&keys=%5B%22astu%22%5D

            For reasons mentioned in the case of the headwordQueryApp, we're not using "auto" or setting "params" directly below.
            -->
            <iron-ajax 
            id="definitionQueryApp" 
            url="https://api.vedavaapi.org/couchdb/dict_entries/_design/index_headwords/_view/index_headwords" 
            params="" loading="{{queryBoxWaiting}}" handle-as="json"
            on-response="_handleDefinitionQueryResponse"
            debounce-duration="300"></iron-ajax>

            <!--A title shown in the middle of the header. TODO: Make this appear to the right instead?-->
            <div main-title="" spacer="">Dict UI</div>
          </app-toolbar>
        </app-header>

        <div style="height: 100%; overflow: auto;">
          <!--The main part of the app, where dict definitions are shown.
          -->
          <template is="dom-repeat" items="[[dictEntries]]">
            <dict-entry-view id="[[item._id]]" dict-entry="[[item]]"></dict-entry-view>
          </template>
        </div>
      </app-header-layout>
    </app-drawer-layout>
`;
  }

  static get is() { return 'dict-ui'; }

  static get properties() {
      return {
          // Bound to the filter property of the combo-box. Changes as user types.
          query: String,
          // This is bound to the combo-box in the header. As a user types a character, valid nearby headwords are set in this array.
          headwords: Array,
          // This is populated with a valid headword the user has selected in the combo-box. Currently unused.
          selectedHeadword: {
              "type": String,
              "value": ""
          },
          // If true, indicates to the combo-box that it should show some icon to let the user know that nearby headwords are being looked up.
          headwordQueryAppWorking: Boolean,

          // Bound to the dict-entry-view cards. Set when definitionQueryApp has done its job.
          dictEntries: Array
      };
  }

  // Listens to click on the result index links, and scrolls to the right dictionary entry.
  _scrollToEntry(e) {
      console.log(e.path);
      var dictEntryLinks = e.path.filter(x => {
          return x.localName == "dict-entry-link";
      });
      if(dictEntryLinks.length > 0) {
          console.log(dictEntryLinks[0].dictEntry._id);
          console.log(dom(this.root).querySelector(`[id="${dictEntryLinks[0].dictEntry._id}"]`));
          dom(this.root).querySelector(`[id="${dictEntryLinks[0].dictEntry._id}"]`).scrollIntoView();
      }
  }

  // This is called when the queryBox value is changed. headwordQueryApp is used to get headwords starting with the query.
  _queryChanged(e) {
      var query = e.detail.value;
      if (query == "") {
          console.log("Ignoring empty query");
      } else {
          // Lets use the headwordQueryApp component to make the AJAX call.
          var headwordQueryApp = this.$.headwordQueryApp;
          // Why are we not doing the databinding more imperatively? See comment above the iron-ajax element.
          headwordQueryApp.params = {
              "limit":500,
              "start_key": `"${query}"`,
              "reduce" : "true",
              "group" : "true"
          }
          headwordQueryApp.generateRequest();
      }
  }

  // This is called once the AJAX call by headwordQueryApp has finished. Auto-suggestions in the query box are changed as a result.
  _handleHeadwordResponse(e) {
    var nextHeadwordRows = e.detail.response.rows;
    var query = this.get("query");
    var headwordsList = nextHeadwordRows.filter(function (row) {
          return row.key.startsWith(query);
    }).map(function (row) {
        return row.key;
    });
    this.set("headwords", Array.from(new Set(headwordsList)));
    console.log(e.detail.response);
  }

  // This is called when the user has chosen a term to look up (ie has pressed "enter") or pressed a button.
  _headwordSelectionHandler(e) {
      console.log(e);
      var value = e.detail.value;
      console.log(value)
      if (value == "") {
          console.log("Ignoring empty query");
      } else {
          // Lets use the definitionQueryApp component to make the AJAX call.
          var definitionQueryApp = this.$.definitionQueryApp;
          // Why are we not doing the databinding more imperatively? See comment above the iron-ajax element.
          definitionQueryApp.params = {
              "keys": `["${value}"]`,
              "reduce" : "false",
              "include_docs" : "true"
          }
          definitionQueryApp.generateRequest();
      }
  }

  // This is called when definitionQueryApp has looked up all dictionary entries.
  // As a result, dict-entry-view elements are displayed.
  _handleDefinitionQueryResponse(e) {
      console.log(e.detail.response);
      var definitionRows = e.detail.response.rows;
      var dictEntries = definitionRows.map(function (row) {
          return row.doc;
      });
      this.set("dictEntries", dictEntries);
  }
}

window.customElements.define(DictUi.is, DictUi);
