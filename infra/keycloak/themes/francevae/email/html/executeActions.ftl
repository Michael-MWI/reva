<#import "email-template.ftl" as layout>
  <@layout.emailLayout ; section>
    <#if section="title">
      Votre compte professionnel France VAE est prêt à être finalisé
      <#elseif section="intro">
        <p>Nous vous remercions pour votre référencement sur la plateforme France VAE. Pour finaliser la création de votre compte, il ne vous reste qu’une seule étape : choisir un mot de passe pour vos futures connexions. Nous vous invitons à cliquer sur le bouton ci-dessous.</p>
      <#elseif section="actionButton">
        <a href="${link}" style="display:inline-block;background:#000099;color:white;font-family:Arial, sans-serif;font-size:14px;font-weight:500;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 16px;mso-padding-alt:0px;" target="_blank">Finaliser mon inscription</a>
      <#elseif section="outro">
        <p>Ce lien est valable 4 jours.</p>
        <p>Si vous avez dépassé ce délai, <a href="https://${properties.keycloakHostname}/realms/reva/login-actions/reset-credentials" target="_blank">nous vous invitons à redemander un mot de passe.</a></p>
        <p>Si jamais vous rencontrez encore des difficultés, n’hésitez pas à nous contacter via la messagerie instantanée (en bas à droite de l’écran sur le site France VAE) ou par email à support@vae.gouv.fr</p>
        <p>L’équipe France VAE.</p>
    </#if>
  </@layout.emailLayout>