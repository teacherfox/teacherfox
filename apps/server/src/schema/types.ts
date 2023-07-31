import { builder } from '../builder.js';

export const MessageDto = builder.prismaObject('Message', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    message: t.exposeString('message'),
  }),
});
