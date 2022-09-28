describe("the student dashboard", () => {
  const WEB_URL = "http://localhost:3000/";
  const API_URL = "http://localhost:8088/api/";

  beforeEach(() => {
    cy.clearCookies();
    cy.visit(WEB_URL);
  });

  it("can see default values", () => {
    cy.location("pathname").should("eq", "/");
    cy.get('[data-test="students-table"]').should("be.visible");
    cy.get('[data-test="add-student"]').should("be.visible");
    cy.get('[data-test="system-role"]').should("be.visible");
    cy.get('[data-test="system-role"]').contains("Admin");
    cy.get(`[data-test*="student-row-"]`).should("have.length", 1);

    cy.get(
      `[data-test*="student-row"]:first-child [data-test="student-ID"]`
    ).contains("1");

    cy.get(
      `[data-test*="student-row"]:first-child [data-test="student-firstName"]`
    ).contains("John");

    cy.get(
      `[data-test*="student-row"]:first-child [data-test="student-lastName"]`
    ).contains("Doe");

    cy.get(
      `[data-test*="student-row"]:first-child [data-test="student-dateOfBirth"]`
    ).contains("2022-09-28");
  });

  it("can change roles", () => {
    cy.get('[data-test="system-role"]')
      .should("be.visible")
      .contains("Admin")
      .click();
    cy.get('[data-test="Admin-Role"]').should("be.visible");
    cy.get('[data-test="Registrar-Role"]').should("be.visible").click();
    cy.get('[data-test="system-role"]')
      .should("be.visible")
      .contains("Registrar");

    cy.get('[data-test="add-student"]').should("not.be.visible");
  });

  it("can view existing student as admin", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="Open-Modal-Student"]').length) {
        cy.get("1");
      }
    });

    cy.get('[data-test="students-table"]').should("be.visible");
    cy.intercept(`${API_URL}*`).as("getStudent");
    cy.get(
      `[data-test*="student-row"]:first-child [data-test="student-actions"]`
    ).click();
    cy.get('[data-test="Open-Modal-Student"]').should("be.visible");
    cy.wait("@getStudent");

    cy.get('[data-test="firstName"]')
      .should("be.visible")
      .should("be.disabled");
    cy.get('[data-test="lastName"]').should("be.visible").should("be.disabled");
    cy.get('[data-test="dateOfBirth"]')
      .should("be.visible")
      .should("be.disabled");
    cy.get('[data-test="submit-student-details"]')
      .should("be.visible")
      .should("be.disabled");

    cy.get('[data-test="cancel-student-details"]')
      .should("be.visible")
      .should("not.be.disabled")
      .click();
  });

  it("can view existing student as registrar", () => {
    cy.get('[data-test="system-role"]')
      .should("be.visible")
      .contains("Admin")
      .click();
    cy.get('[data-test="Admin-Role"]').should("be.visible");
    cy.get('[data-test="Registrar-Role"]').should("be.visible").click();
    cy.get('[data-test="system-role"]')
      .should("be.visible")
      .contains("Registrar");

    cy.get('[data-test="students-table"]').should("be.visible");
    cy.get(
      `[data-test*="student-row"]:first-child [data-test="student-actions"]`
    ).click();
    cy.get('[data-test="Open-Modal-Student"]').should("be.visible");
    cy.get('[data-test="firstName"]')
      .should("be.visible")
      .should("not.be.disabled");
    cy.get('[data-test="lastName"]')
      .should("be.visible")
      .should("not.be.disabled");
    cy.get('[data-test="dateOfBirth"]')
      .should("be.visible")
      .should("not.be.disabled");
    cy.get('[data-test="submit-student-details"]')
      .should("be.visible")
      .should("not.be.disabled");
  });

  it("can create a new student with family", () => {
    cy.get('[data-test="add-student"]').should("be.visible").click();
    cy.get('[data-test="Open-Modal-Student"]').should("be.visible");
    // Add Family Member inputs to show in error fields
    cy.get('[data-test="add-family-member"]').should("be.visible").click();
    // Try to submit without inputs to show errors in fields
    cy.get('[data-test="submit-student-details"]')
      .scrollIntoView()
      .should("be.visible")
      .should("not.be.disabled")
      .click();

    // Input Student's Basic Details + nationality
    cy.get('[data-test="firstName-error"]').should("be.visible");
    cy.get('[data-test="firstName"]')
      .should("be.visible")
      .should("not.be.disabled")
      .type("Abdulrahim");

    cy.get('[data-test="lastName-error"]').should("be.visible");
    cy.get('[data-test="lastName"]')
      .should("be.visible")
      .should("not.be.disabled")
      .type("Naser Eddin");

    cy.get('[data-test="dateOfBirth-error"]').should("be.visible");
    cy.get('[data-test="dateOfBirth"]')
      .should("be.visible")
      .should("not.be.disabled")
      .type("1995-03-30T12:30");

    cy.get('[data-test="nationality-error"]').should("be.visible");
    cy.get('[data-test="nationality"]').should("be.visible").click();
    cy.get('[data-test="nationality-1"]').should("be.visible").click();

    // Input first family Basic Details + nationality + relationship
    cy.get('[data-test="family.0.firstName-error"]').should("be.visible");
    cy.get('[data-test="family.0.firstName"]')
      .should("be.visible")
      .should("not.be.disabled")
      .type("Ammar");

    cy.get('[data-test="family.0.lastName-error"]').should("be.visible");
    cy.get('[data-test="family.0.lastName"]')
      .should("be.visible")
      .should("not.be.disabled")
      .type("Naser Eddin");

    cy.get('[data-test="family.0.dateOfBirth-error"]').should("be.visible");
    cy.get('[data-test="family.0.dateOfBirth"]')
      .should("be.visible")
      .should("not.be.disabled")
      .type("1993-12-21T12:30");

    cy.get('[data-test="family.0.nationality-error"]').should("be.visible");
    cy.get('[data-test="family.0.nationality"]').should("be.visible").click();
    cy.get('[data-test="family.0.nationality-1"]').should("be.visible").click();

    cy.get('[data-test="family.0.relationship-error"]').should("be.visible");
    cy.get('[data-test="family.0.relationship"]').should("be.visible").click();
    cy.get('[data-test="family.0.relationship-1"]')
      .should("be.visible")
      .click();

    cy.get('[data-test="submit-student-details"]')
      .should("be.visible")
      .should("not.be.disabled")
      .click();
    cy.wait(2000);

    cy.get(
      `[data-test*="student-row"]:nth-child(2) [data-test="student-firstName"]`
    ).contains("Abdulrahim");

    cy.get(
      `[data-test*="student-row"]:nth-child(2) [data-test="student-lastName"]`
    ).contains("Naser Eddin");

    cy.get(
      `[data-test*="student-row"]:nth-child(2) [data-test="student-dateOfBirth"]`
    ).contains("1995-03-30");
  });

  it("can edit newly created student as registrar", () => {
    // Change Role to Registrar
    cy.get('[data-test="system-role"]')
      .should("be.visible")
      .contains("Admin")
      .click();
    cy.get('[data-test="Admin-Role"]').should("be.visible");
    cy.get('[data-test="Registrar-Role"]').should("be.visible").click();
    cy.get('[data-test="system-role"]')
      .should("be.visible")
      .contains("Registrar");

    // Click on the second row's action
    cy.get('[data-test="students-table"]').should("be.visible");
    cy.get(
      `[data-test*="student-row"]:nth-child(2) [data-test="student-actions"]`
    ).click();
    cy.get('[data-test="Open-Modal-Student"]').should("be.visible");

    // Update Student's basic details
    cy.get('[data-test="firstName"]')
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain.value", "Abdulrahim")
      .type(" Modified");
    cy.get('[data-test="lastName"]')
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain.value", "Naser Eddin")
      .type(" Modified");
    cy.get('[data-test="dateOfBirth"]')
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain.value", "1995-03-30T08:30")
      .type("1993-12-21T12:30");

    // Update Nationality
    cy.get('[data-test="nationality"]').should("be.visible").click();
    cy.get('[data-test="nationality-2"]').should("be.visible").click();

    // Open card for family member 1 and update details
    cy.get('[data-test="family-member-1"]').should("be.visible").click();
    cy.get('[data-test="family.0.firstName"]')
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain.value", "Ammar")
      .type(" updated");
    cy.get('[data-test="family.0.lastName"]')
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain.value", "Naser Eddin")
      .type(" updated");
    cy.get('[data-test="family.0.dateOfBirth"]')
      .should("be.visible")
      .should("not.be.disabled")
      .should("contain.value", "1993-12-21T08:30")
      .type("1990-05-05T12:12");
    cy.get('[data-test="family.0.nationality"]').should("be.visible").click();
    cy.get('[data-test="family.0.nationality-2"]').should("be.visible").click();
    cy.get('[data-test="family.0.relationship"]').should("be.visible").click();
    cy.get('[data-test="family.0.relationship-0"]')
      .should("be.visible")
      .click();

    // Submit
    cy.get('[data-test="submit-student-details"]').scrollIntoView().click();
  });

  it("can delete family members for created students", () => {
    // Change Role to Registrar
    cy.get('[data-test="system-role"]')
      .should("be.visible")
      .contains("Admin")
      .click();
    cy.get('[data-test="Admin-Role"]').should("be.visible");
    cy.get('[data-test="Registrar-Role"]').should("be.visible").click();
    cy.get('[data-test="system-role"]')
      .should("be.visible")
      .contains("Registrar");

    // Click on the second row's action
    cy.get('[data-test="students-table"]').should("be.visible");
    cy.get(
      `[data-test*="student-row"]:nth-child(2) [data-test="student-actions"]`
    ).click();
    cy.get('[data-test="Open-Modal-Student"]').should("be.visible");

    // Open card for family member 1 and click on delete
    cy.get('[data-test="family-member-1"]').should("be.visible").click();
    cy.get('[data-test="family.0.delete"]').scrollIntoView().click();
    // Submit
    cy.get('[data-test="submit-student-details"]').scrollIntoView().click();
  });
});

export {};
