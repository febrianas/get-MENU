import { Injectable } from '@nestjs/common';
import { MenuItem } from './entities/menu-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}


    // Requirements:
    // - your code should result in EXACTLY one SQL query no matter the nesting level or the amount of menu items.
    // - it should work for infinite level of depth (children of childrens children of childrens children, ...)
    // - verify your solution with `npm run test`
    // - do a `git commit && git push` after you are done or when the time limit is over
    // Hints:
    // - open the `src/menu-items/menu-items.service.ts` file
    // - partial or not working answers also get graded so make sure you commit what you have
    // Sample response on GET /menu:
    // ```json
    // [
    //     {
    //         "id": 1,
    //         "name": "All events",
    //         "url": "/events",
    //         "parentId": null,
    //         "createdAt": "2021-04-27T15:35:15.000000Z",
    //         "children": [
    //             {
    //                 "id": 2,
    //                 "name": "Laracon",
    //                 "url": "/events/laracon",
    //                 "parentId": 1,
    //                 "createdAt": "2021-04-27T15:35:15.000000Z",
    //                 "children": [
    //                     {
    //                         "id": 3,
    //                         "name": "Illuminate your knowledge of the laravel code base",
    //                         "url": "/events/laracon/workshops/illuminate",
    //                         "parentId": 2,
    //                         "createdAt": "2021-04-27T15:35:15.000000Z",
    //                         "children": []
    //                     },
    //                     {
    //                         "id": 4,
    //                         "name": "The new Eloquent - load more with less",
    //                         "url": "/events/laracon/workshops/eloquent",
    //                         "parentId": 2,
    //                         "createdAt": "2021-04-27T15:35:15.000000Z",
    //                         "children": []
    //                     }
    //                 ]
    //             },
    //             {
    //                 "id": 5,
    //                 "name": "Reactcon",
    //                 "url": "/events/reactcon",
    //                 "parentId": 1,
    //                 "createdAt": "2021-04-27T15:35:15.000000Z",
    //                 "children": [
    //                     {
    //                         "id": 6,
    //                         "name": "#NoClass pure functional programming",
    //                         "url": "/events/reactcon/workshops/noclass",
    //                         "parentId": 5,
    //                         "createdAt": "2021-04-27T15:35:15.000000Z",
    //                         "children": []
    //                     },
    //                     {
    //                         "id": 7,
    //                         "name": "Navigating the function jungle",
    //                         "url": "/events/reactcon/workshops/jungle",
    //                         "parentId": 5,
    //                         "createdAt": "2021-04-27T15:35:15.000000Z",
    //                         "children": []
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // ]
  async getMenuItems() {

    const queryManager = getManager();
    const queryEvents = queryManager
      .createQueryBuilder()
      .select([
        'a.*',
      ])
      .from('MenuItem', 'a')
      .where('parentId is null')
    const dataEvents = await queryEvents.getRawMany();

    const queryChilldren = queryManager
    .createQueryBuilder()
    .select([
      'a.*',
    ])
    .from('MenuItem', 'a')
  const dataChilldren = await queryChilldren.getRawMany();

    const queryChilldren2 = queryManager
    .createQueryBuilder()
    .select([
        'a.*',
    ])
    .from('MenuItem', 'a')
    .where('parentId > 1')
    const dataChilldren2 = await queryChilldren2.getRawMany();

    const resultChilldren2 = dataChilldren2.map(function(x){
        x.children = []
        return x
      })
  const resultChilldren = dataChilldren.map(function(x){
    const parseChildren2 = resultChilldren2.find((ld) => ld.parentId === x.parentId);
    x.children = parseChildren2
    return x
  })
  const resultEvents = dataEvents.map(function (x) {
    const parseChildren = resultChilldren.find((ld) => ld.parentId === x.parentId);
    x.children = parseChildren
  })
  return resultEvents
  }
}
