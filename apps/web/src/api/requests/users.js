import api from "@/api/index";

const getUsers = async () => {
  let endpoint = `/api/users/`;

  await api.get(endpoint);
};

const updateUsers = async (payload) => {
  let endpoint = `/api/users/`;

  await api.put(endpoint, payload);
};

export const apiMembers = {
  getUsers,
  updateUsers,
};
