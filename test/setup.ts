import * as utils from '../src/utils';

jest.spyOn(utils, 'id').mockReturnValue('123');
jest.spyOn(process, 'cwd').mockImplementation(() => '/usr/dir');
jest.spyOn(global.console, 'info').mockImplementation(jest.fn());
jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
