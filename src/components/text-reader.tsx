import { useContext, useEffect, useRef, useState } from 'react'
import text_it from '../syncmap.json'
import text_por from '../syncmap_ch1_por.json'
import text_fr from '../syncmap_ch1_fr.json'
import text_por_ch2 from '../syncmap_por_ch2.json'
import text_sk from '../syncmap_ch1_sk.json'
import text_sp from '../syncmap_ch1_sp.json'
import text_sp_ch2 from '../syncmap_ch2_sp.json'
import { useQuery, useMutation } from '@apollo/client'
import { GET_WORDS, ADD_WORD } from '../queries'
import { WordContext } from '../App'

function binarySearch(arr: any[], val: any, comp: any) {
    let start = 0
    let end = arr.length - 1

    while (start <= end) {
        let mid = Math.floor((start + end) / 2)

        // If arr[mid] === val
        if (comp(arr[mid], val) === 0) {
            return arr[mid]
        }

        //if val < arr[mid]
        if (comp(arr[mid], val) === -1) {
            end = mid - 1
        } else {
            start = mid + 1
        }
    }
    return -1
}

const TextReader = ({ setTime, highlight, currentTime, setSelection }: any) => {
    const { words, setWords, user: user_var } = useContext(WordContext)
    let user: any
    user = user_var
    if (user_var === 'Ciaran2') {
        user = 'Ciaran'
    }
    if (user_var === 'Ciaran_SP2') {
        user = 'Ciaran_SP'
    }

    let text: any
    if (user_var === 'Ciaran') {
        text = text_por
    } else if (user === 'JJ') {
        text = text_it
    } else if (user === 'Mark') {
        text = text_fr
    } else if (user_var === 'Ciaran2') {
        text = text_por_ch2
    } else if (user_var === 'Aidan') {
        text = text_sk
    } else if (user_var === 'Ciaran_SP') {
        text = text_sp
    } else if (user_var === 'Ciaran_SP2') {
        text = text_sp_ch2
    }

    const refList = useRef<any>({})
    const container = useRef<any>(null)
    const [previousFrag, setPreviousFrag] = useState<any>(null)
    const [known, setKnown] = useState<any>({})
    const { loading, error, data } = useQuery(GET_WORDS, {
        variables: { user },
    })
    const [addWord, { data: addWordData }] = useMutation(ADD_WORD)
    const [fragments, setFragments] = useState<any>([])

    useEffect(() => {
        if (data) {
            const wordHash = {} as any
            data.words.forEach((word: any) => (wordHash[word.word] = word))
            setWords(wordHash)
        }
    }, [data])

    useEffect(() => {
        console.log('text' + text.fragments)
        let frags: any = text.fragments.filter(
            (val: any) => val.lines[0] !== ''
        )
        frags = frags.map((frag: any) => ({
            ...frag,
            words: frag.lines[0].split(' '),
        }))
        setFragments(frags)
    }, [])

    const currentFrag = binarySearch(
        text.fragments,
        currentTime,
        (frag: any, time: number) => {
            let begin = parseFloat(frag.begin)
            let end = parseFloat(frag.end)

            if (time >= begin && time <= end) {
                return 0
            } else if (time < begin) {
                return -1
            } else {
                return 1
            }
        }
    )

    useEffect(() => {
        if (refList.current[currentFrag.id]) {
            if (previousFrag) {
                refList.current[previousFrag.id].className =
                    'transition ease-in delay-100 p-1 flex flex-row whitespace-pre flex-wrap text-frost'
            }
            refList.current[currentFrag.id].className =
                'transition ease-in delay-100 p-1 bg-arcticLight bg-opacity-40 text-frost rounded-xl flex flex-row whitespace-pre flex-wrap'
            setPreviousFrag(currentFrag)

            const fragOffset = Math.abs(
                container.current.scrollTop -
                    refList.current[currentFrag.id].offsetTop
            )
            console.log('of: ' + fragOffset)
            console.log('Height: ' + container.current.offsetHeight)
            container.current.scrollTo({
                behavior:
                    fragOffset > container.current.offsetHeight * 1.5
                        ? 'auto'
                        : 'smooth',
                left: 0,
                top:
                    refList.current[currentFrag.id].offsetTop -
                    container.current.offsetHeight / 2,
            })
        }
    }, [currentTime])

    /*useEffect(() => {
    const wordSet = new Set();
    fragments.forEach((fragment: any) =>
      fragment.words.forEach((frag: string) => {
        const word = frag
          .replace(/[^\w\sA-Za-zÀ-ÖØ-öø-ÿ]|_/g, "")
          .replace(/\s+/g, " ")
          .toLowerCase();
        wordSet.add(word);
      }),
    );
    const totalWords = wordSet.size;
    let count = 0;
    Object.keys(words).forEach((word: any) =>
      wordSet.has(word) ? (count += 1) : null,
    );
    console.log(
      "Encountered: " + (count / totalWords) * 100 + "% of unique words",
    );

    let totalWordCount = 0;
    let knownWordCount = 0;
    fragments.forEach((fragment: any) =>
      fragment.words.forEach((frag: string) => {
        const word = frag
          .replace(/[^\w\sA-Za-zÀ-ÖØ-öø-ÿ]|_/g, "")
          .replace(/\s+/g, " ")
          .toLowerCase();
        totalWordCount += 1;
        if (words[word]) {
          knownWordCount += 1;
        }
      }),
    );
    console.log(
      "Encountered: " +
        (knownWordCount / totalWordCount) * 100 +
        "% of all words",
    );
  }, [words, fragments]);*/

    const handleWordClick = (word: string) => {
        //Set the word to learning if not in word list
        if (!words[word]) {
            addWord({
                variables: {
                    user: user,
                    word: word,
                    learning: true,
                    known: false,
                    impressions: 1,
                    ignore: false,
                },
            })
            setWords({
                ...words,
                [word]: {
                    word: word,
                    learning: true,
                    known: false,
                    impressions: 1,
                    ignore: false,
                },
            })
        }
        setSelection({ word, isPhrase: false })
    }

    return (
        <div
            id="reader"
            ref={(el) => (container.current = el)}
            className="text-lg h-4/5 p-10 overflow-scroll gradient"
        >
            {fragments.map((fragment: any, i: number) => (
                <div
                    key={i}
                    ref={(el) => (refList.current[fragment.id] = el)}
                    className="transition ease-in delay-100 p-1 text-frost flex flex-row whitespace-pre flex-wrap"
                    onDoubleClick={() => setTime(fragment.begin)}
                >
                    {fragment.words.map((frag: string) => {
                        const word = frag
                            .replace(/[^\w\sA-Za-zÀ-ÖØ-öø-ÿ]|_/g, '')
                            .replace(/\s+/g, ' ')
                            .toLowerCase()
                        return (
                            <p
                                className={
                                    words[word]
                                        ? JSON.parse(words[word].learning) ===
                                          true
                                            ? 'text-petal'
                                            : 'text-grass'
                                        : ''
                                }
                                onClick={() => {
                                    handleWordClick(word)
                                }}
                            >
                                {frag + ' '}
                            </p>
                        )
                    })}
                </div>
            ))}
            <div className="h-20"></div>
        </div>
    )
}

export default TextReader
