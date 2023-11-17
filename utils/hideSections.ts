import {ConditionalProperty, ConditionalPropertyCallbackContext, SlugSourceContext} from 'sanity'

export function showForTypes<Type>(types: Type[], key?: string): ConditionalProperty {
  return (context: SlugSourceContext | ConditionalPropertyCallbackContext) =>
    !types.includes(context.parent?.[key ?? 'type'])
}

export function hideForTypes<Type>(types: Type[], key?: string): ConditionalProperty {
  return (context: SlugSourceContext | ConditionalPropertyCallbackContext) =>
    types.includes(context.parent?.[key ?? 'type'])
}
