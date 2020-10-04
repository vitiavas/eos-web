import {
  Spectator,
  createTestComponentFactory,
} from "@netbasal/spectator/jest";
import { defineGlobalsInjections } from "@ngneat/spectator";

import { CardComponent as Card } from "./card.component";
import { FormsModule } from "@angular/forms";

describe("Component: Card Component", () => {
  let spectator: Spectator<Card>;
  let component;
  const createComponent = createTestComponentFactory<Card>({
    component: Card,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    component.record = {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    };
  });

  it("exists", () => {
    expect(component).toBeDefined();
  });

  it("renders a record if one is given", () => {
    expect(component.record).toEqual({
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    });
  });

  it("Emit Click Event with record data when click function is called", () => {
    const clickEventSpy = spyOn(spectator.component.clickEvent, "emit");
    spectator.component.click();
    expect(clickEventSpy).toHaveBeenCalledWith(component.record);
  });

  it("Expect component to be visible after view init", () => {
    spectator.component.ngAfterViewInit();
    setTimeout(() => {
      expect(spectator.component.visible).toBe(true);
    });
  });
});
