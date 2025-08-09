-- Assign menu roles to ADMIN and USER for all menu items
-- Format: (id, role_id, menu_item_id, can_view, can_edit, can_delete)
INSERT INTO role_menu_permission (id, role_id, menu_item_id, can_view, can_edit, can_delete) VALUES
  (1, 1, 1, true, false, false), -- ADMIN: Dashboard
  (2, 1, 2, true, false, false), -- ADMIN: Users
  (3, 1, 3, true, false, false), -- ADMIN: Menu Management
  (4, 1, 4, true, false, false), -- ADMIN: Tickets
  (5, 1, 5, true, false, false), -- ADMIN: Settings
  (6, 1, 10, true, false, false), -- ADMIN: Admin Analytics
  (7, 3, 6, true, false, false), -- USER: Profile
  (8, 3, 7, true, false, false), -- USER: My Tickets
  (9, 3, 8, true, false, false), -- USER: Raise Ticket
  (10, 3, 9, true, false, false) -- USER: Help Center
ON CONFLICT (id) DO NOTHING;
