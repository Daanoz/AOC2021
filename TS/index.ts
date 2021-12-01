import { terminal as term } from 'terminal-kit'
import program from 'commander'
import { from, Observable, Subject, timer, of, merge } from 'rxjs'
import { switchMap, map, takeUntil, debounce, catchError } from 'rxjs/operators'
import { ChildProcess, fork } from 'child_process'
import path from 'path'
import fs from 'fs'

const logo = [`
________  ________  ________   _______  ________    _______   _____     
|\\   __  \\|\\   __  \\|\\   ____\\ /  ___  \\|\\   __  \\  /  ___  \\ / __  \\    
\\ \\  \\|\\  \\ \\  \\|\\  \\ \\  \\___|/__/|_/  /\\ \\  \\|\\  \\/__/|_/  /|\\/_|\\  \\   
 \\ \\   __  \\ \\  \\\\\\  \\ \\  \\   |__|//  / /\\ \\  \\\\\\  \\__|//  / ||/ \\ \\  \\  
  \\ \\  \\ \\  \\ \\  \\\\\\  \\ \\  \\____  /  /_/__\\ \\  \\\\\\  \\  /  /_/__   \\ \\  \\ 
   \\ \\__\\ \\__\\ \\_______\\ \\_______\\\\________\\ \\_______\\|\\________\\  \\ \\__\\
    \\|__|\\|__|\\|_______|\\|_______|\\|_______|\\|_______| \\|_______|   \\|__|                                                                                                                                                  
`].join('\n')
term(logo +' '.repeat(59) + 'By Daan Sieben\n')

program
  .option('-i, --input <input>', 'input file')
  .option('-d, --day <day>', 'day to run')
  .option('-m, --mode <mode>', 'mode (run or watch)')
program.parse(process.argv)

const destroy$ = new Subject()
term.on('key' , (name: string) => {
	if ( name === 'CTRL_C' ) { 
        if (cmd) {
            cmd.kill()
        }
        destroy$.next()
    }
})

const choosePuzzleMode = (): Observable<string> => {
    const options = [
        {label: 'Run mode', key: 'run' },
        {label: 'Watch mode (re-run on file change)', key: 'watch' },
    ]
    if (program.mode) {
        if (options.find(o => o.key === program.mode)) {
            return of(program.mode)
        }
    }

    term.white.bold( 'In which mode do you want to run the puzzle?.\n')
    return from(term.singleColumnMenu(
        options.map(o => o.label),
        {cancelable: true, exitOnUnexpectedKey: true}
    ).promise.then((response?: {selectedIndex: number}) => {
        if (!response) { return Promise.reject() }
        if (!options[response.selectedIndex]) { return Promise.reject() }
        return options[response.selectedIndex].key
    }))
}

const choosePuzzle = (): Observable<string> => {
    const puzzleList = fs.readdirSync(__dirname, {withFileTypes: true})
        .filter(item => item.isDirectory)
        .filter(item => item.name.match(/\d\d/))
        .map(item => item.name)
    if (program.day) {
        if (puzzleList.indexOf(program.day) >= 0) { return of(program.day) }
        if (program.day.length < 2 &&
            puzzleList.indexOf('0' + program.day) >= 0) {
            return of('0' + program.day)
        }
    }

    term.white.bold('Which puzzle do you want to run?.\n')
    return from(term.gridMenu(
        puzzleList,
        {exitOnUnexpectedKey: true}
    ).promise.then((response?: {selectedText: string}) => {
        if (!response) { return Promise.reject() }
        return response.selectedText
    }))
}

const watchDir$ = (path: string) => {
    return new Observable<boolean>(subscriber => {
        const watcher = fs.watch(
            path,
            {persistent: true, recursive: true},
            ( ) => subscriber.next(true)
        )
        return () => watcher.close()
    }).pipe(debounce(() => timer(100)))
}

let cmd: ChildProcess
const run = (puzzle: string, mode: string): Observable<boolean> => {
    term('\n\n')
    const puzzleDir = path.join(__dirname, puzzle)
    const run$ = new Observable<boolean>(subscriber => {
        term.bold('\nExecuting puzzle %s\n\n', puzzle)
        const args: string[] = []
        if (program.input) { args.push('--input', program.input) }
        if (cmd) {
            cmd.kill()
        }
        cmd = fork(
            'index.ts', args,
            {
                execArgv: ['-r', 'ts-node/register'],
                env: {
                    ...process.env,
                    isWatching: (mode === 'watch') ? '1' : '0'
                },
                cwd: puzzleDir
            }
        )
        if (!cmd) { return subscriber.error('Execution failed') }
        cmd.on('close', (code) => {
            if (code !== 0) {
                subscriber.error('Error code: ' + code)
                return
            }
            subscriber.next(true)
            subscriber.complete()
        })
        return () => cmd.kill()
    })
    if (mode === 'watch') {
        return merge(
            of(true),
            watchDir$(puzzleDir)
        ).pipe(
            switchMap(
                () => run$.pipe(
                    catchError(() => of(true))
                )
            )
        )
    } else {
        return run$
    }
}

choosePuzzle().pipe(
    switchMap(puzzle => choosePuzzleMode().pipe(map(mode => ({
        puzzle, mode
    })))),
    switchMap((conf: {puzzle: string, mode: string}) => run(conf.puzzle, conf.mode)),
    takeUntil(destroy$)
).subscribe(
    () => {},
    err => {
        if (err) { term.red('%s\n', err) }
        process.exit(0)
    },
    () => process.exit(0)
)