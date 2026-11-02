import { createSlice } from "@reduxjs/toolkit";
import { initialWorkspaces, initialUsers } from "@/shared/data/mockData";

const STORAGE_KEY = "nexus_workspaces_state_v1";

const loadWorkspacesFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load saved workspaces:", err);
  }
  return initialWorkspaces;
};

const initialData = loadWorkspacesFromStorage();
const savedWorkspaceId = localStorage.getItem("nexus_active_workspace_id");
const defaultActiveWorkspace =
  initialData.find((w) => w.id === savedWorkspaceId) || initialData[0] || null;

const persist = (workspaces, activeId) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
    if (activeId) {
      localStorage.setItem("nexus_active_workspace_id", activeId);
    }
  } catch (err) {
    console.error("Failed to persist workspace state:", err);
  }
};

const initialState = {
  workspaces: initialData,
  currentWorkspace: defaultActiveWorkspace,
  currentUser: initialUsers[0],
  allUsers: initialUsers,
  searchQuery: "",
  loading: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action) => {
      const workspaceId = action.payload;
      const found = state.workspaces.find((w) => w.id === workspaceId);
      if (found) {
        state.currentWorkspace = found;
        localStorage.setItem("nexus_active_workspace_id", workspaceId);
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addWorkspace: (state, action) => {
      state.workspaces.push(action.payload);
      state.currentWorkspace = action.payload;
      persist(state.workspaces, action.payload.id);
    },
    updateWorkspace: (state, action) => {
      const updated = action.payload;
      state.workspaces = state.workspaces.map((w) => (w.id === updated.id ? updated : w));
      if (state.currentWorkspace?.id === updated.id) {
        state.currentWorkspace = updated;
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    deleteWorkspace: (state, action) => {
      const wsId = action.payload;
      state.workspaces = state.workspaces.filter((w) => w.id !== wsId);
      if (state.currentWorkspace?.id === wsId) {
        state.currentWorkspace = state.workspaces[0] || null;
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    addProject: (state, action) => {
      const newProject = action.payload;
      const wsId = newProject.workspaceId || state.currentWorkspace?.id;
      state.workspaces = state.workspaces.map((ws) => {
        if (ws.id === wsId) {
          return {
            ...ws,
            projects: [newProject, ...(ws.projects || [])],
          };
        }
        return ws;
      });
      if (state.currentWorkspace?.id === wsId) {
        state.currentWorkspace = {
          ...state.currentWorkspace,
          projects: [newProject, ...(state.currentWorkspace.projects || [])],
        };
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    updateProject: (state, action) => {
      const updated = action.payload;
      const wsId = updated.workspaceId || state.currentWorkspace?.id;
      state.workspaces = state.workspaces.map((ws) => {
        if (ws.id === wsId) {
          return {
            ...ws,
            projects: ws.projects.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
          };
        }
        return ws;
      });
      if (state.currentWorkspace?.id === wsId) {
        state.currentWorkspace = {
          ...state.currentWorkspace,
          projects: state.currentWorkspace.projects.map((p) =>
            p.id === updated.id ? { ...p, ...updated } : p
          ),
        };
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    deleteProject: (state, action) => {
      const { projectId, workspaceId } = action.payload;
      const wsId = workspaceId || state.currentWorkspace?.id;
      state.workspaces = state.workspaces.map((ws) => {
        if (ws.id === wsId) {
          return {
            ...ws,
            projects: ws.projects.filter((p) => p.id !== projectId),
          };
        }
        return ws;
      });
      if (state.currentWorkspace?.id === wsId) {
        state.currentWorkspace = {
          ...state.currentWorkspace,
          projects: state.currentWorkspace.projects.filter((p) => p.id !== projectId),
        };
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    addTask: (state, action) => {
      const newTask = action.payload;
      const wsId = state.currentWorkspace?.id;
      state.workspaces = state.workspaces.map((ws) => {
        if (ws.id === wsId) {
          return {
            ...ws,
            projects: ws.projects.map((p) => {
              if (p.id === newTask.projectId) {
                return {
                  ...p,
                  tasks: [newTask, ...(p.tasks || [])],
                };
              }
              return p;
            }),
          };
        }
        return ws;
      });
      if (state.currentWorkspace) {
        state.currentWorkspace = {
          ...state.currentWorkspace,
          projects: state.currentWorkspace.projects.map((p) => {
            if (p.id === newTask.projectId) {
              return {
                ...p,
                tasks: [newTask, ...(p.tasks || [])],
              };
            }
            return p;
          }),
        };
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    updateTask: (state, action) => {
      const updatedTask = action.payload;
      const wsId = state.currentWorkspace?.id;
      state.workspaces = state.workspaces.map((ws) => {
        if (ws.id === wsId) {
          return {
            ...ws,
            projects: ws.projects.map((p) => {
              if (p.id === updatedTask.projectId) {
                return {
                  ...p,
                  tasks: p.tasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t)),
                };
              }
              return p;
            }),
          };
        }
        return ws;
      });
      if (state.currentWorkspace) {
        state.currentWorkspace = {
          ...state.currentWorkspace,
          projects: state.currentWorkspace.projects.map((p) => {
            if (p.id === updatedTask.projectId) {
              return {
                ...p,
                tasks: p.tasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t)),
              };
            }
            return p;
          }),
        };
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    deleteTasks: (state, action) => {
      const { projectId, taskIds } = action.payload;
      const idsToDelete = Array.isArray(taskIds) ? taskIds : [taskIds];
      const wsId = state.currentWorkspace?.id;

      state.workspaces = state.workspaces.map((ws) => {
        if (ws.id === wsId) {
          return {
            ...ws,
            projects: ws.projects.map((p) => {
              if (p.id === projectId) {
                return {
                  ...p,
                  tasks: p.tasks.filter((t) => !idsToDelete.includes(t.id)),
                };
              }
              return p;
            }),
          };
        }
        return ws;
      });

      if (state.currentWorkspace) {
        state.currentWorkspace = {
          ...state.currentWorkspace,
          projects: state.currentWorkspace.projects.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                tasks: p.tasks.filter((t) => !idsToDelete.includes(t.id)),
              };
            }
            return p;
          }),
        };
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    addComment: (state, action) => {
      const { projectId, taskId, comment } = action.payload;
      const wsId = state.currentWorkspace?.id;
      const commentWithMeta = {
        id: `c_${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...comment,
      };

      state.workspaces = state.workspaces.map((ws) => {
        if (ws.id === wsId) {
          return {
            ...ws,
            projects: ws.projects.map((p) => {
              if (p.id === projectId) {
                return {
                  ...p,
                  tasks: p.tasks.map((t) => {
                    if (t.id === taskId) {
                      return {
                        ...t,
                        comments: [...(t.comments || []), commentWithMeta],
                      };
                    }
                    return t;
                  }),
                };
              }
              return p;
            }),
          };
        }
        return ws;
      });

      if (state.currentWorkspace) {
        state.currentWorkspace = {
          ...state.currentWorkspace,
          projects: state.currentWorkspace.projects.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                tasks: p.tasks.map((t) => {
                  if (t.id === taskId) {
                    return {
                      ...t,
                      comments: [...(t.comments || []), commentWithMeta],
                    };
                  }
                  return t;
                }),
              };
            }
            return p;
          }),
        };
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    addProjectMember: (state, action) => {
      const { projectId, member } = action.payload;
      const wsId = state.currentWorkspace?.id;

      state.workspaces = state.workspaces.map((ws) => {
        if (ws.id === wsId) {
          return {
            ...ws,
            projects: ws.projects.map((p) => {
              if (p.id === projectId) {
                const existing = p.members || [];
                if (existing.some((m) => m.userId === member.userId)) return p;
                return {
                  ...p,
                  members: [...existing, member],
                };
              }
              return p;
            }),
          };
        }
        return ws;
      });

      if (state.currentWorkspace) {
        state.currentWorkspace = {
          ...state.currentWorkspace,
          projects: state.currentWorkspace.projects.map((p) => {
            if (p.id === projectId) {
              const existing = p.members || [];
              if (existing.some((m) => m.userId === member.userId)) return p;
              return {
                ...p,
                members: [...existing, member],
              };
            }
            return p;
          }),
        };
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    removeProjectMember: (state, action) => {
      const { projectId, userId } = action.payload;
      const wsId = state.currentWorkspace?.id;

      state.workspaces = state.workspaces.map((ws) => {
        if (ws.id === wsId) {
          return {
            ...ws,
            projects: ws.projects.map((p) => {
              if (p.id === projectId) {
                return {
                  ...p,
                  members: (p.members || []).filter((m) => m.userId !== userId),
                };
              }
              return p;
            }),
          };
        }
        return ws;
      });

      if (state.currentWorkspace) {
        state.currentWorkspace = {
          ...state.currentWorkspace,
          projects: state.currentWorkspace.projects.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                members: (p.members || []).filter((m) => m.userId !== userId),
              };
            }
            return p;
          }),
        };
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    inviteMember: (state, action) => {
      const { email, role } = action.payload;
      const wsId = state.currentWorkspace?.id;
      let matchedUser = state.allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!matchedUser) {
        const namePart = email.split("@")[0].replace(/[._]/g, " ");
        const capitalized = namePart
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ");
        matchedUser = {
          id: `user_${Date.now()}`,
          name: capitalized,
          email,
          role: role === "ADMIN" ? "Admin" : "Member",
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          initials: capitalized.substring(0, 2).toUpperCase(),
          color: "#8b5cf6",
          createdAt: new Date().toISOString(),
        };
        state.allUsers.push(matchedUser);
      }

      const newMember = {
        id: `wm_${Date.now()}`,
        userId: matchedUser.id,
        role: role || "MEMBER",
        user: matchedUser,
      };

      state.workspaces = state.workspaces.map((ws) => {
        if (ws.id === wsId) {
          const currentMembers = ws.members || [];
          if (currentMembers.some((m) => m.user.email.toLowerCase() === email.toLowerCase())) {
            return ws;
          }
          return {
            ...ws,
            members: [...currentMembers, newMember],
          };
        }
        return ws;
      });

      if (state.currentWorkspace?.id === wsId) {
        const currentMembers = state.currentWorkspace.members || [];
        if (!currentMembers.some((m) => m.user.email.toLowerCase() === email.toLowerCase())) {
          state.currentWorkspace = {
            ...state.currentWorkspace,
            members: [...currentMembers, newMember],
          };
        }
      }
      persist(state.workspaces, state.currentWorkspace?.id);
    },
    resetToDefaultData: (state) => {
      state.workspaces = initialWorkspaces;
      state.currentWorkspace = initialWorkspaces[0];
      state.allUsers = initialUsers;
      state.currentUser = initialUsers[0];
      persist(initialWorkspaces, initialWorkspaces[0].id);
    },
  },
});

export const {
  setCurrentWorkspace,
  setSearchQuery,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addProject,
  updateProject,
  deleteProject,
  addTask,
  updateTask,
  deleteTasks,
  addComment,
  addProjectMember,
  removeProjectMember,
  inviteMember,
  resetToDefaultData,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;

