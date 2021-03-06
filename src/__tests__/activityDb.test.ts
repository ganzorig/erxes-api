import * as faker from 'faker';
import { ActivityLogs, Customers, Deals, Segments } from '../db/models';

import { activityLogFactory, customerFactory, dealFactory, segmentFactory } from '../db/factories';
import './setup.ts';

describe('Test activity model', () => {
  afterEach(async () => {
    // Clearing test data
    await ActivityLogs.deleteMany({});
    await Deals.deleteMany({});
    await Segments.deleteMany({});
    await Customers.deleteMany({});
  });

  test('Activity add activity', async () => {
    const contentId = faker.random.uuid();
    const contentType = 'customer';
    const createdBy = faker.random.uuid();
    const action = 'create';

    const activity = await ActivityLogs.addActivityLog({
      contentId,
      contentType,
      createdBy,
      action,
    });

    expect(activity).toBeDefined();
    expect(activity.contentId).toEqual(contentId);
    expect(activity.contentType).toEqual(contentType);
    expect(activity.createdBy).toEqual(createdBy);
    expect(activity.action).toEqual(action);
  });

  test('Activity remove activity', async () => {
    const activity = await activityLogFactory();

    await ActivityLogs.removeActivityLog(activity.contentId);

    const count = await ActivityLogs.find({ contentId: activity.contentId }).countDocuments();

    expect(count).toBe(0);
  });

  test('Activity create board item log', async () => {
    const deal = await dealFactory({});

    const activity = await ActivityLogs.createBoardItemLog({ item: deal, contentType: 'deal' });

    expect(activity.contentId).toEqual(deal._id);
  });

  test('Activity create log from widget', async () => {
    const item = await customerFactory({});

    const activity1 = await ActivityLogs.createLogFromWidget('create-customer', item);
    const activity2 = await ActivityLogs.createLogFromWidget('create-company', item);

    expect(activity1.contentId).toEqual(item._id);
    expect(activity2.contentId).toEqual(item._id);
  });

  test('Activity create coc log', async () => {
    const item = await customerFactory({ mergedIds: ['1', '2'] });
    const item2 = await customerFactory({ integrationId: '123', ownerId: undefined });

    const activity1 = await ActivityLogs.createCocLog({ coc: item, contentType: 'customer' });
    const activity2 = await ActivityLogs.createCocLog({ coc: item2, contentType: 'customer' });

    expect(activity1.contentId).toEqual(item._id);
    expect(activity2.contentId).toEqual(item2._id);
  });

  test('Activity create board item movement log', async () => {
    const item = await dealFactory({});

    const activity1 = await ActivityLogs.createBoardItemMovementLog(item, 'deal', '123', {});

    expect(activity1.contentId).toEqual(item._id);
  });

  test('Activity create board item movement log', async () => {
    const customer = await customerFactory({});
    const segment1 = await segmentFactory({});
    const segment2 = await segmentFactory({});

    const foundedActivity = await ActivityLogs.create({
      contentType: 'customer',
      action: 'segment',
      contentId: customer._id,
      content: {
        id: segment1._id,
        content: segment2,
      },
    });

    const activity1 = await ActivityLogs.createSegmentLog(segment1, customer, 'customer');
    const activity2 = await ActivityLogs.createSegmentLog(segment2, customer, 'customer');

    expect(activity1._id).toEqual(foundedActivity._id);
    expect(activity2._id).toEqual(activity2._id);
  });
});
