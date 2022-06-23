import { Principal } from "@dfinity/principal"
import { useEffect } from "react"
import { Identity, useDfusionActor } from "src/canisters/actor"
import { useNotifyActor } from "src/canisters/actor/use-notify-actor"
import { FeatureState, useAppDispatch, usePlugStore } from "src/store"
import { userExtAction, useUserExtStore } from "src/store/features/userExt"

export const useUserExtInit = () => {
  const { isConnected, principalId } = usePlugStore()
  const { likes, userExtState, subscribeesState } = useUserExtStore()

  // const dfusionActor = useMemo(
  //   () => useDfusionActor(Identity.caller ?? undefined),
  //   [isConnected]
  // ) // not valid for hook rule

  const dfusionActor = useDfusionActor(undefined)
  const notifyActor = useNotifyActor(undefined)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (principalId
      && isConnected
      && userExtState !== FeatureState.NotStarted) {
      dispatch(userExtAction.setUserExtState(FeatureState.Loading))
      dfusionActor?.getUser(Principal.fromText(principalId))
        .then(res => {
          if (res.length > 0) {
            res[0] && dispatch(userExtAction.setAll(res[0]))
            dispatch(userExtAction.setUserExtState(FeatureState.Idle))
          }
        })
    }
  }, [principalId, isConnected, dfusionActor])

  useEffect(() => {
    if (principalId && notifyActor
      && subscribeesState === FeatureState.NotStarted) {
      dispatch(userExtAction.setSubscribeesState(FeatureState.Loading))
      notifyActor.getSubscribees(Principal.fromText(principalId))
        .then(res => {
          console.log('subscribe', res)
          dispatch(userExtAction.setSubscribees(
            res.map(item => item.toString())
          ))
        }).finally(() => {
          dispatch(userExtAction.setSubscribeesState(FeatureState.Idle))
        })
    }
  }, [principalId, notifyActor])

}