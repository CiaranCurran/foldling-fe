import React, { createContext, useContext, useEffect, useState } from 'react'
import VideoPlayer from './components/video-player'
import TextReader from './components/text-reader'
import SplitPane from 'react-split-pane'
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    useMutation,
} from '@apollo/client'
import axios from 'axios'
import { json } from 'stream/consumers'
import { SET_IGNORE, SET_KNOWN } from './queries'
import { AiFillSound } from 'react-icons/ai'
import { ReactComponent as Penguin } from './assets/penguin.svg'
import { LANGUAGE } from './constants'
import './App.scss'

export const WordContext = createContext({} as any)

function App() {
    // we use an object so we can trigger rerenders even if the value is the same
    const [time, setTime] = useState({ time: 0 })
    const [currentTime, setCurrentTime] = useState(time.time)
    const [selection, setSelection] = useState<any>({})
    const [translation, setTranslation] = useState()
    const [words, setWords] = useState<any>({})
    const [setKnown] = useMutation(SET_KNOWN)
    const [setIgnore] = useMutation(SET_IGNORE)
    const [isLoading, setLoading] = useState(false)
    const [user, setUser] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        var t = '' as any
        function gText(e: any) {
            t = document.getSelection()?.toString()

            if (t.split(' ').length > 1) {
                //setSelection({ word: t });
                console.log(t.split('\n').join(''))
                setSelection({ word: t.split('\n').join(''), isPhrase: true })
            }
        }

        document.addEventListener('mouseup', gText)

        return () => {
            document.removeEventListener('mouseup', gText)
        }
    }, [])

    let LANG: string
    if (user === 'Ciaran') {
        LANG = 'PT'
    } else {
        LANG = 'IT'
    }

    // Generates a translation for the latest selection
    useEffect(() => {
        const translate = async () => {
            try {
                setLoading(true)
                const result = await axios.post(
                    'https://api-free.deepl.com/v2/translate',
                    null,
                    {
                        params: {
                            auth_key: '999303fb-58b4-9bc2-1893-3d8c557d683f:fx',
                            text: selection.word,
                            target_lang: 'EN',
                            source_lang: LANG,
                        },
                    }
                )
                setTranslation(result.data.translations[0].text)
                setLoading(false)
            } catch (e) {
                console.log(e)
            }
        }
        if (Object.keys(selection).length) {
            translate()
        }
    }, [selection])

    // If the base time changes update the current time
    useEffect(() => {
        setCurrentTime(time.time)
    }, [time])

    const setTimeOnPlayer = (seconds: number) => {
        console.log('Setting Time')
        setTime({ ...{ time: seconds } })
    }

    const setWordToKnown = () => {
        setKnown({ variables: { word: selection.word, user: user } })
        setWords({
            ...words,
            [selection.word]: {
                ...words[selection.word],
                known: true,
                learning: false,
                user: user,
            },
        })
    }

    const setWordToIgnore = () => {
        setIgnore({ variables: { word: selection.word, user: user } })
        setWords({
            ...words,
            [selection.word]: {
                ...words[selection.word],
                ignore: true,
                learning: false,
                user: user,
            },
        })
    }

    const toggleFullscreen = () => {
        console.log('going fullscreen')
        document.documentElement.requestFullscreen()
    }

    const textToSpeech = () => {}

    const login = () => {
        if (user === 'JJ' || user === 'Mark' || user === 'Ciaran') {
            setLoggedIn(true)
        }
    }

    if (!loggedIn) {
        return (
            <div className="login">
                <Penguin />
                <div className="login-container">
                    <form>
                        <input
                            type="text"
                            name="name"
                            value={user}
                            className="input"
                            onChange={(e) => {
                                setUser(e.target.value)
                            }}
                        />
                        <input
                            type="submit"
                            value="Submit"
                            className="submit"
                            onClick={() => {
                                login()
                            }}
                        />
                    </form>
                </div>
            </div>
        )
    }

    return (
        <WordContext.Provider value={{ words, setWords, user }}>
            <div className="flex flex-row h-full items-center justify-evenly text-white bg-arctic">
                <button
                    className="bg-transparent
                 hover:bg-blue-700
                 text-arctic
                 py-1
                 px-2
                 rounded absolute top-0 left-0 z-50"
                    onClick={toggleFullscreen}
                >
                    full
                </button>
                <SplitPane split="vertical" minSize={50} defaultSize={400}>
                    <div className="h-full flex justify-center items-center p-10">
                        <VideoPlayer
                            time={time}
                            setCurrentTime={(secs: number) =>
                                setCurrentTime(secs)
                            }
                        />
                    </div>
                    <div className="h-full flex justify-center items-center flex-col pt-10">
                        <TextReader
                            setTime={setTimeOnPlayer}
                            currentTime={currentTime}
                            setSelection={setSelection}
                        />
                        <div className="w-11/12 bg-transparent flex-1 mb-10 rounded-xl border-4 border-ice p-2">
                            {selection.word ? (
                                <div className="flex flex-row">
                                    <div>{selection.word}</div>
                                    <div className="mt-1 ml-2">
                                        <AiFillSound onClick={textToSpeech} />
                                    </div>
                                </div>
                            ) : null}
                            {isLoading ? (
                                <div className="loader">Loading</div>
                            ) : (
                                <div className="text-grass">{translation}</div>
                            )}
                            {selection.word ? (
                                selection.isPhrase ? null : (
                                    <div className="absolute bottom-12 right-10">
                                        <button
                                            className="
                  bg-blue-500
                  hover:bg-blue-700
                  text-white
                  font-bold
                  py-1
                  px-2
                  rounded m-1"
                                            onClick={setWordToKnown}
                                        >
                                            I know this word
                                        </button>
                                        <button
                                            className="
                 bg-blue-500
                 hover:bg-blue-700
                 text-white
                 font-bold
                 py-1
                 px-2
                 rounded"
                                            onClick={setWordToIgnore}
                                        >
                                            Ignore this word
                                        </button>
                                    </div>
                                )
                            ) : null}
                        </div>
                    </div>
                </SplitPane>
            </div>
        </WordContext.Provider>
    )
}

export default App
