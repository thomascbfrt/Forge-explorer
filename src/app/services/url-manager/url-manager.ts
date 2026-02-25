import { ActivatedRoute, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import * as LZString from 'lz-string';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UrlManager {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  getEncodedUrl(data: { key: string; value: any }[]): string {
    const queryParams: { [key: string]: string } = {};

    data.forEach((item) => {
      const { key, value } = item;

      let strValue: string;
      if (value == null) {
        strValue = '';
      } else if (Array.isArray(value)) {
        strValue = value.join(',');
      } else if (typeof value === 'object') {
        strValue = JSON.stringify(value);
      } else {
        strValue = String(value);
      }
      queryParams[key] = LZString.compressToEncodedURIComponent(strValue);
    });

    // const baseUrl = window.location.origin;
    const baseUrl = new URL(window.location.origin);
    Object.entries(queryParams).forEach(([key, value]) => {
      baseUrl.searchParams.append(key, value);
    });
    const url = this.router.createUrlTree([environment.FAVORIS_BASE_LINK], { queryParams });

    return window.location.origin + this.router.serializeUrl(url);
  }

  // Doit pouvoir reccuperé les paramètres dans l'URL et les encodé
  getUncodedUrlParams(mutation?: (param: string) => any): {
    [key: string]: string;
  } {
    const snapshotParams = this.route.snapshot.queryParamMap;
    const queryParams: { [key: string]: string } = {};

    snapshotParams.keys.forEach((key) => {
      let value = LZString.decompressFromEncodedURIComponent(
        snapshotParams.get(key)!,
      );
      if (mutation) value = mutation(value);
      queryParams[key] = value;
    });

    return queryParams;
  }
}
