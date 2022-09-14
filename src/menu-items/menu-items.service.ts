import { Injectable } from '@nestjs/common';
import { MenuItem } from './entities/menu-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';

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
                        // {
                        //     "id": 7,
                        //     "name": "Navigating the function jungle",
                        //     "url": "/events/reactcon/workshops/jungle",
                        //     "parentId": 5,
                        //     "createdAt": "2021-04-27T15:35:15.000000Z",
                        //     "children": []
                        // }
    //                 ]
    //             }
    //         ]
    //     }
    // ]
  async getMenuItems() {
    let data = []
    const menuItem = await this.menuItemRepository.find({
        where:{
            parentId:IsNull()
        }
    });
    for(let i= 0;i<menuItem.length;i++){
        let children = [];
        const queryChilldren =  await this.menuItemRepository.find({
            where:{
                parentId:menuItem[i].id
            }
        })
        for(let j= 0;j<queryChilldren.length;j++){
            let children2 = [];
            const queryChilldren2 =  await this.menuItemRepository.find({
                where:{
                    parentId:queryChilldren[j].id
                }
            })
            for(let k= 0;k<queryChilldren2.length;k++){
                children2[k] = {
                    "id": queryChilldren2[k].id,
                    "name": queryChilldren2[k].name,
                    "url": queryChilldren2[k].url,
                    "parentId": queryChilldren2[k].parentId,
                    "createdAt": queryChilldren2[k].createdAt,
                    "children": []
                }
            }
            children[j] = {
                "id": queryChilldren[j].id,
                "name": queryChilldren[j].name,
                "url": queryChilldren[j].url,
                "parentId": queryChilldren[j].parentId,
                "createdAt": queryChilldren[j].createdAt,
                "children": children2
            }
        }
        data[i]={
            "id": menuItem[i].id,
            "name": menuItem[i].name,
            "url": menuItem[i].url,
            "parentId": menuItem[i].parentId,
            "createdAt": menuItem[i].createdAt,
            "children": children
        }
    }
    return data;
  }
}
