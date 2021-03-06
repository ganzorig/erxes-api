import { boardFactory, pipelineFactory, stageFactory, ticketFactory, userFactory } from '../db/factories';
import { Boards, Pipelines, Stages, Tickets } from '../db/models';
import { IBoardDocument, IPipelineDocument, IStageDocument } from '../db/models/definitions/boards';
import { ITicketDocument } from '../db/models/definitions/tickets';
import { IUserDocument } from '../db/models/definitions/users';

import './setup.ts';

describe('Test Tickets model', () => {
  let board: IBoardDocument;
  let pipeline: IPipelineDocument;
  let stage: IStageDocument;
  let ticket: ITicketDocument;
  let user: IUserDocument;

  beforeEach(async () => {
    // Creating test data
    board = await boardFactory();
    pipeline = await pipelineFactory({ boardId: board._id });
    stage = await stageFactory({ pipelineId: pipeline._id });
    ticket = await ticketFactory({ stageId: stage._id });
    user = await userFactory({});
  });

  afterEach(async () => {
    // Clearing test data
    await Boards.deleteMany({});
    await Pipelines.deleteMany({});
    await Stages.deleteMany({});
    await Tickets.deleteMany({});
  });

  test('Get ticket', async () => {
    try {
      await Tickets.getTicket('fakeId');
    } catch (e) {
      expect(e.message).toBe('Ticket not found');
    }

    const response = await Tickets.getTicket(ticket._id);

    expect(response).toBeDefined();
  });

  // Test ticket
  test('Create ticket', async () => {
    const createdTicket = await Tickets.createTicket({
      stageId: ticket.stageId,
      userId: user._id,
    });

    expect(createdTicket).toBeDefined();
    expect(createdTicket.stageId).toEqual(stage._id);
    expect(createdTicket.userId).toEqual(user._id);
  });

  test('Update ticket', async () => {
    const ticketStageId = 'fakeId';
    const updatedTicket = await Tickets.updateTicket(ticket._id, {
      stageId: ticketStageId,
    });

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket.stageId).toEqual(ticketStageId);
    expect(updatedTicket.closeDate).toEqual(ticket.closeDate);
  });

  test('Update ticket orders', async () => {
    const dealToOrder = await ticketFactory({});

    const [updatedTicket, updatedDealToOrder] = await Tickets.updateOrder(stage._id, [
      { _id: ticket._id, order: 9 },
      { _id: dealToOrder._id, order: 3 },
    ]);

    expect(updatedTicket.stageId).toBe(stage._id);
    expect(updatedTicket.order).toBe(3);
    expect(updatedDealToOrder.order).toBe(9);
  });

  test('Watch ticket', async () => {
    await Tickets.watchTicket(ticket._id, true, user._id);

    const watchedTicket = await Tickets.getTicket(ticket._id);

    expect(watchedTicket.watchedUserIds).toContain(user._id);

    // testing unwatch
    await Tickets.watchTicket(ticket._id, false, user._id);

    const unwatchedTicket = await Tickets.getTicket(ticket._id);

    expect(unwatchedTicket.watchedUserIds).not.toContain(user._id);
  });
});
