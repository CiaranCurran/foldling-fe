import YouTube from 'react-youtube'
import { useContext, useEffect, useRef, useState } from 'react'
import { WordContext } from '../App'

const TIME_UPDATE_RATE = 400 // time in milliseconds between each time update, too small and the scroll will lag.

function useAsyncReference(value: any) {
    const ref = useRef(value)
    const [, forceRender] = useState(false)

    function updateState(newState: any) {
        ref.current = newState
        forceRender((s) => !s)
    }

    return [ref, updateState]
}

const VideoPlayer = ({ time, setCurrentTime }: any) => {
    const [player, setPlayer] = useAsyncReference(null) as any
    const [shouldTrackTime, setShouldTrackTime] = useAsyncReference(
        false
    ) as any
    const { user } = useContext(WordContext)

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            e.preventDefault()
            console.log(player.current)
            if (e.code === 'Space') {
                if (player.current.playerInfo.playerState === 1) {
                    player.current.pauseVideo()
                } else {
                    player.current.playVideo()
                }
            }
        })
    }, [])

    useEffect(() => {
        if (player.current) {
            console.log('in useeffect')
            console.log('its:' + player.current.getCurrentTime())
            player.current.seekTo(time.time)
        }
    }, [time])

    const onReady = (e: any) => {
        console.log('Saving video player to state')
        setPlayer(e.target)
    }

    useEffect(() => {
        const trackTime = () => {
            setTimeout(() => {
                if (shouldTrackTime.current) {
                    console.log('Time: ' + player.current.getCurrentTime())
                    setCurrentTime(player.current.getCurrentTime())
                    trackTime()
                }
            }, 400)
        }

        if (shouldTrackTime) {
            trackTime()
        }
    }, [shouldTrackTime.current])

    const onStateChange = (e: any) => {
        // If the video starts playing
        if (e.data === 1 && !shouldTrackTime.current) {
            // Attach a process that calls every second
            setShouldTrackTime(true)
        } else if (shouldTrackTime.current) {
            setShouldTrackTime(false)
        }
    }

    var youtubeID
    if (user === 'Ciaran') {
        youtubeID = 'DA--T_3T3mI'
    } else if (user === 'JJ') {
        youtubeID = 'i9-M-Ys-9rc'
    } else if (user === 'Mark') {
        youtubeID = 'oBQVXgQJh9E'
    } else if (user === 'Ciaran2') {
        youtubeID = 'YglyUkLxack'
    } else if (user === 'Aidan') {
        youtubeID = 'M_4gLSX5fcA'
    } else if (user === 'Ciaran_SP') {
        youtubeID = 'LKNYP-DHg7w'
    } else if (user === 'Ciaran_SP2') {
        youtubeID = 'hHjDIVIpHcc'
    }

    return (
        <YouTube
            videoId={youtubeID}
            containerClassName={'videoContainer'}
            opts={{ width: '100%', height: '100%' }}
            onReady={onReady}
            onStateChange={onStateChange}
        />
    )
}

export default VideoPlayer
