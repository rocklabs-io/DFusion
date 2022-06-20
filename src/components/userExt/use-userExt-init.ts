import { Principal } from "@dfinity/principal"
import { useEffect } from "react"
import { Identity, useDfusionActor } from "src/canisters/actor"
import { useAppDispatch, usePlugStore } from "src/store"
import { userExtAction } from "src/store/features/userExt"

export const useUserExtInit = () => {
  const { isConnected, principalId } = usePlugStore()

  // const dfusionActor = useMemo(
  //   () => useDfusionActor(Identity.caller ?? undefined),
  //   [isConnected]
  // ) // not valid for hook rule
  const dfusionActor = useDfusionActor(Identity.caller ?? undefined)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (principalId && isConnected) {
      dfusionActor?.getUser(Principal.fromText(principalId)).then(res => {
        if (res.length > 0) {
          console.log(res)
          res[0] && dispatch(userExtAction.setAll(res[0]))
          // res[0]?.likes && dispatch(userExtAction.setAllLikes(res[0]?.likes))
          // res[0]?.entries && dispatch(userExtAction.setEntries(res[0].entries))
          // res[0]?.following && dispatch(userExtAction.setEntries(res[0].entries))
        }
      })
    }
  }, [ principalId, isConnected, dfusionActor])
}