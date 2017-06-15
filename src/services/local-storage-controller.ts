import {Injectable} from "@angular/core";
import {NativeStorage} from "@ionic-native/native-storage";


@Injectable()
export class LocalStorageController {
  constructor(private storage: NativeStorage) {
  }

  async updateStorage(resourceType: string, resources: any[]): Promise<void> {
    let map: any = {};
    resources.forEach(resource => map[resource.id] = resource);
    let oldMap: any;
    oldMap = await this.storage.getItem(resourceType);
    if (oldMap)
      map = Object.assign({map, oldMap});
    await this.storage.setItem(resourceType, map);
  }

  async getFromStorage(resourceType: string, returnAsMap: boolean = false): Promise<any> {
    let map: any;
    try {
      map = await this.storage.getItem(resourceType);
    } catch (err) {
      console.log('error!-------', err);
    }
    if (!returnAsMap) {
      if (map)
        return Promise.resolve(Object.keys(map).map(id => map[id]));
      return Promise.resolve([]);
    }
    return map ? map : Promise.resolve({});
  }

  async removeFromStorage(resourceType: string, resources: any[], all: boolean = false) {
    try {
      if (all)
        this.storage.remove(resourceType);
      else {
        let data = await this.storage.getItem(resourceType);
        console.log('data', data);
        console.log('to be removed', resources)
        resources.forEach(resource => {
          if (data[resource.id])
            delete data[resource.id];
        });
        this.storage.setItem(resourceType, data);
      }
    } catch (err) {
      console.log('ERROR at deleting', err);
    }
  }
}
