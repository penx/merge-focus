/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { render, cleanup } from "react-testing-library";
import userEvent from "user-event";
import "jest-dom/extend-expect";

import MergeFocus from ".";

afterEach(cleanup);

it("merges input focus and blur events", () => {
  const blur = jest.fn();
  const focus = jest.fn();

  const { getByLabelText, getByTitle, getByText } = render(
    <form title="Form">
      <MergeFocus keys={["day", "month", "year"]} onBlur={blur} onFocus={focus}>
        {inputs => (
          <>
            <div>
              <label>
                Day: <input name="day" {...inputs.day} />
              </label>
            </div>
            <div>
              <label>
                Month: <input name="month" {...inputs.month} />
              </label>
            </div>
            <div>
              <label>
                Year: <input name="year" {...inputs.year} />
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

  expect(focus).toHaveBeenCalledTimes(0);

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

it("handles refs being removed", () => {
  const blur = jest.fn();
  const focus = jest.fn();

  class TestForm extends React.Component {
    state = {
      showMonth: true
    };

    render() {
      const { showMonth } = this.state;

      return (
        <form title="Form">
          <MergeFocus
            keys={["day", "month", "year"]}
            onBlur={blur}
            onFocus={focus}
          >
            {inputs => (
              <>
                <div>
                  <label>
                    Day: <input name="day" {...inputs.day} />
                  </label>
                </div>
                {showMonth && (
                  <div>
                    <label>
                      Month: <input name="month" {...inputs.month} />
                    </label>
                  </div>
                )}
                <div>
                  <label>
                    Year: <input name="year" {...inputs.year} />
                  </label>
                </div>
              </>
            )}
          </MergeFocus>
          <button type="button">click me</button>
          <button
            type="button"
            onClick={e => this.setState({ showMonth: false })}
          >
            hide month
          </button>
        </form>
      );
    }
  }

  const { getByLabelText, getByTitle, getByText } = render(<TestForm />);

  const day = getByLabelText("Day:");
  const month = getByLabelText("Month:");
  const year = getByLabelText("Year:");
  const form = getByTitle("Form");
  const button = getByText("click me");
  const hideMonth = getByText("hide month");

  expect(focus).toHaveBeenCalledTimes(0);

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

  userEvent.click(hideMonth);

  expect(form).toHaveFormValues({ day: "10", year: "12" });
  expect(form).not.toHaveFormValues({ month: "11" });

  userEvent.click(day);
  userEvent.type(day, "20");

  userEvent.click(year);

  userEvent.type(year, "22");

  expect(form).toHaveFormValues({ day: "20", year: "22" });

  expect(focus).toHaveBeenCalledTimes(2);
  expect(blur).toHaveBeenCalledTimes(1);

  userEvent.click(button);

  expect(blur).toHaveBeenCalledTimes(2);

  // TODO: can we check that refs have actually been removed? Maybe MergeFocus should have a refs prop that accepts a function?
});

// TODO: merge onBlur onFocus and ref functions with existing usage

it("merges radio focus and blur events", () => {
  const blur = jest.fn();
  const focus = jest.fn();

  const { getByLabelText, getByTitle, getByText } = render(
    <form title="Form">
      <MergeFocus keys={["yes", "no", "maybe"]} onBlur={blur} onFocus={focus}>
        {inputs => (
          <>
            <div>
              <label>
                Yes:
                <input name="answer" value="yes" type="radio" {...inputs.yes} />
              </label>
            </div>
            <div>
              <label>
                No:
                <input name="answer" value="no" type="radio" {...inputs.no} />
              </label>
            </div>
            <div>
              <label>
                Maybe:
                <input
                  name="answer"
                  value="maybe"
                  type="radio"
                  {...inputs.maybe}
                />
              </label>
            </div>
          </>
        )}
      </MergeFocus>
      <button type="button">click me</button>
    </form>
  );

  const yes = getByLabelText("Yes:");
  const no = getByLabelText("No:");
  const maybe = getByLabelText("Maybe:");
  const form = getByTitle("Form");
  const button = getByText("click me");

  expect(focus).toHaveBeenCalledTimes(0);

  userEvent.click(yes);
  userEvent.click(maybe);
  userEvent.click(no);

  expect(form).toHaveFormValues({ answer: "no" });

  expect(focus).toHaveBeenCalledTimes(1);
  expect(blur).toHaveBeenCalledTimes(0);

  userEvent.click(button);

  expect(blur).toHaveBeenCalledTimes(1);
});
