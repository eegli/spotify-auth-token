import fs from 'fs';
import * as utils from '../src/utils';

jest.spyOn(fs, 'existsSync').mockReturnValue(true);
jest.spyOn(process, 'cwd').mockImplementation(() => '/usr/dir');
jest.spyOn(global.console, 'info').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
jest.spyOn(utils, 'id').mockReturnValue('123');
