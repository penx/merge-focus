/* eslint-disable jsx-a11y/label-has-associated-control */

import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Welcome } from "@storybook/react/demo";

import MergeFocus from "..";

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("Button")} />
));

storiesOf("MergeFocus", module).add("default", () => (
  <form title="Form">
    <MergeFocus onBlur={action("blur")} onFocus={action("focus")}>
      {mergeFocus => (
        <>
          <div>
            <label>
              Day: <input name="day" {...mergeFocus} />
            </label>
          </div>
          <div>
            <label>
              Month: <input name="month" {...mergeFocus} />
            </label>
          </div>
          <div>
            <label>
              Year: <input name="year" {...mergeFocus} />
            </label>
          </div>
        </>
      )}
    </MergeFocus>
    <button type="button">click me</button>
  </form>
));
