import { Server } from './constants'; 
import logger from './logger';
import axios from 'axios';
import { exec } from 'child_process'; // change to spawn?

// 5 min cache time
const cacheTime = 5 * 60 * 1000;
let data: any, lastUpdated = 0;
const API_URL = 'https://api.mcsrvstat.us/2/' + ((Server.Port == 25565) ? Server.DNS : (Server.Address + ':' + Server.Port));

/**
 * Whether or not the server is currently being executed.
 * @type boolean
 */
export let serverCurrentlyRunning: boolean = false;

/**
 * Starts the server by executing the server shell script at the Server Path.
 * @async
 */
export async function startServer() {
    if (!serverCurrentlyRunning) {
        serverCurrentlyRunning = true;
        const executable = exec(`cd ${Server.Path} && ./start.sh`);
        executable.stdout?.on('data', (data) => {
            logger.info('[SERVER] ' + data);
        });
        executable.stderr?.on('data', (data) => {
            logger.error('[SERVER] ' + data);
        })
        executable.on('close', (code) => {
            logger.error('[SERVER] Server process closed.');
            serverCurrentlyRunning = false;
        })
    }
}

/**
 * Fetches the raw JSON data from the end API (api.mcsrvstat.us).
 * @returns {JSON} The raw JSON data response.
 */
const fetchStatusJSON = function (): any {
    return axios.get(API_URL)
            .then(response => {
                if (response.status == 200)
                    return response;
                else
                    throw response.statusText;
            })
            .then(response => response.data);
}

/**
 * Updates and obtains the raw JSON status of the server.
 * @returns {JSON} The JSON response data of the server.
 */
export const getServerStatus = function (): any {
    logger.info("Fetching server information.");
    // Cache expired/doesn't exist
    if (Date.now() > lastUpdated + cacheTime || data === undefined) {
        return fetchStatusJSON()
            .then((body: any) => {
                data = body;
                lastUpdated = body.last_updated * 1000 || Date.now();
                lastUpdated = Math.min(lastUpdated, Date.now()); // Last updated time can't be in the future
                lastUpdated = Math.max(lastUpdated, Date.now() - cacheTime + 60000); // Wait at least 1 minute
                return data;
            })
            .catch((error: any) => {
                logger.error(error);
            });
    } 
    
    // Use cached data
    else
        return data;
}