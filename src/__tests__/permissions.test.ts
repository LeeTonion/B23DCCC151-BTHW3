// src/__tests__/permissions.test.ts
import { can } from "../lib/permissions";

describe("can(role, action) - Permission Matrix", () => {
  // view_deadline
  describe("view_deadline", () => {
    it("guest can view deadline", () => {
      expect(can("guest", "view_deadline")).toBe(true);
    });
    it("user can view deadline", () => {
      expect(can("user", "view_deadline")).toBe(true);
    });
    it("admin can view deadline", () => {
      expect(can("admin", "view_deadline")).toBe(true);
    });
  });

  // mark_done
  describe("mark_done", () => {
    it("guest cannot mark done", () => {
      expect(can("guest", "mark_done")).toBe(false);
    });
    it("user can mark done", () => {
      expect(can("user", "mark_done")).toBe(true);
    });
    it("admin can mark done", () => {
      expect(can("admin", "mark_done")).toBe(true);
    });
  });

  // add_deadline
  describe("add_deadline", () => {
    it("guest cannot add deadline", () => {
      expect(can("guest", "add_deadline")).toBe(false);
    });
    it("user cannot add deadline", () => {
      expect(can("user", "add_deadline")).toBe(false);
    });
    it("admin can add deadline", () => {
      expect(can("admin", "add_deadline")).toBe(true);
    });
  });

  // delete_deadline
  describe("delete_deadline", () => {
    it("guest cannot delete deadline", () => {
      expect(can("guest", "delete_deadline")).toBe(false);
    });
    it("user cannot delete deadline", () => {
      expect(can("user", "delete_deadline")).toBe(false);
    });
    it("admin can delete deadline", () => {
      expect(can("admin", "delete_deadline")).toBe(true);
    });
  });
});

