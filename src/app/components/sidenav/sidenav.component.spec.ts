/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import {
    ContentService, AppConfigService, AuthenticationService,
    UserPreferencesService, StorageService, AlfrescoApiService,
    CookieService, LogService
} from '@alfresco/adf-core';
import { BrowsingFilesService } from '../../common/services/browsing-files.service';

import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
    let fixture;
    let component: SidenavComponent;
    let contentService: ContentService;
    let browsingService: BrowsingFilesService;
    let appConfig: AppConfigService;
    let appConfigSpy;

    const navItem = {
        label: 'some-label',
        route: {
            url: '/some-url'
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                MatMenuModule,
                TranslateModule.forRoot(),
                RouterTestingModule
            ],
            declarations: [
                SidenavComponent
            ],
            providers: [
                LogService,
                CookieService,
                AlfrescoApiService,
                StorageService,
                UserPreferencesService,
                AuthenticationService,
                ContentService,
                AppConfigService,
                BrowsingFilesService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents()
        .then(() => {
            contentService = TestBed.get(ContentService);
            browsingService = TestBed.get(BrowsingFilesService);
            appConfig = TestBed.get(AppConfigService);

            fixture = TestBed.createComponent(SidenavComponent);
            component = fixture.componentInstance;

            appConfigSpy = spyOn(appConfig, 'get').and.returnValue([navItem]);
        });
    }));

    it('should update node on change', () => {
        fixture.detectChanges();
        const node: any = { entry: { id: 'someNodeId' } };

        browsingService.onChangeParent.next(<any>node);

        expect(component.node).toBe(node);
    });

    it('should have permission to create content', () => {
        fixture.detectChanges();
        spyOn(contentService, 'hasPermission').and.returnValue(true);
        const node: any = {};

        expect(component.canCreateContent(node)).toBe(true);
        expect(contentService.hasPermission).toHaveBeenCalledWith(node, 'create');
    });

    it('should not have permission to create content for missing node', () => {
        fixture.detectChanges();
        spyOn(contentService, 'hasPermission').and.returnValue(true);

        expect(component.canCreateContent(null)).toBe(false);
        expect(contentService.hasPermission).not.toHaveBeenCalled();
    });

    it('should not have permission to create content based on node permission', () => {
        fixture.detectChanges();
        spyOn(contentService, 'hasPermission').and.returnValue(false);
        const node: any = {};

        expect(component.canCreateContent(node)).toBe(false);
        expect(contentService.hasPermission).toHaveBeenCalledWith(node, 'create');
    });

    describe('menu', () => {
        it('should build menu from array', () => {
            appConfigSpy.and.returnValue([navItem, navItem]);
            fixture.detectChanges();

            expect(component.navigation).toEqual([[navItem, navItem]]);
        });

        it('should build menu from object', () => {
            appConfigSpy.and.returnValue({ a: [navItem, navItem], b: [navItem, navItem] });
            fixture.detectChanges();

            expect(component.navigation).toEqual([[navItem, navItem], [navItem, navItem]]);
        });
    });
});
