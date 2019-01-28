/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { render, cleanup } from "react-testing-library";
import userEvent from "user-event";
import "jest-dom/extend-expect";

import MergeFocus from ".";

afterEach(cleanup);

it("works", () => {
  const blur = jest.fn();
  const focus = jest.fn();

  const { getByLabelText, getByTitle, getByText } = render(
    <form title="Form">
      <MergeFocus onBlur={blur} onFocus={focus}>
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
  );

  const day = getByLabelText("Day:");
  const month = getByLabelText("Month:");
  const year = getByLabelText("Year:");
  const form = getByTitle("Form");
  const button = getByText("click me");

  userEvent.click(day);
  userEvent.type(day, "10");
  userEvent.click(month);
  userEvent.type(month, "11");
  userEvent.click(year);
  userEvent.type(year, "12");

  expect(form).toHaveFormValues({ day: "10", month: "11", year: "12" });
  expect(focus).toHaveBeenCalledTimes(1);
  expect(blur).toHaveBeenCalledTimes(0);

  userEvent.click(button);

  expect(blur).toHaveBeenCalledTimes(1);
});
