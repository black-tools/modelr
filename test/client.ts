import {test as localTest} from './client/local';
import {test as fullstackTest} from './client/fullstack';

async function test(){
    // localTest();
    fullstackTest();
}

test()
    .then(() => {
        console.log('=== End test.');
    });
