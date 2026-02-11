const forgetPasswordTemplate = (otp, expiry) => ({
  subject: "DevDash – Password Reset Verification",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; color: #333;">
      
      <h3>Password Reset Request</h3>

      <p>
        We received a request to reset your DevDash account password.
      </p>

      <p><strong>Your One-Time Password (OTP):</strong></p>

      <p style="font-size: 22px; font-weight: bold; letter-spacing: 2px;">
        ${otp}
      </p>

      <p>
        This OTP is valid for <strong>${expiry} minutes</strong>.
      </p>

      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} DevDash
      </p>

    </div>
  `,
});

const registrationTemplate = (otp, expiry) => ({
  subject: "DevDash – Verify Your Email Address",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; color: #333;">

      <h3>Welcome to DevDash 👋</h3>

      <p>
        Thanks for creating an account. To complete your registration,
        please verify your email address using the OTP below.
      </p>

      <p style="font-size: 22px; font-weight: bold; letter-spacing: 2px;">
        ${otp}
      </p>

      <p>
        This OTP is valid for <strong>${expiry} minutes</strong>.
      </p>

      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        If you didn’t create a DevDash account, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} DevDash
      </p>

    </div>
  `,
});

const changePasswordRequest = (otp, expiry) => ({
  subject: "DevDash – Confirm Password Change",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; color: #333;">

      <h3>Password Change Verification</h3>

      <p>
        A request was made to change your account password.
        Please use the OTP below to confirm this action.
      </p>

      <p style="font-size: 22px; font-weight: bold; letter-spacing: 2px;">
        ${otp}
      </p>

      <p>
        This OTP is valid for <strong>${expiry} minutes</strong>.
      </p>

      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        If you did not request a password change, please secure your account immediately.
      </p>

      <hr style="border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} DevDash
      </p>

    </div>
  `,
});

const updateTaskTemplate = ({
  title,
  description,
  status,
  priority,
  dueDate,
  assignedBy,
}) => ({
  subject: `Task Updated: ${title}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">

      <h3>Task Update Notification</h3>

      <p>
        The task <strong>"${title}"</strong> has been updated by
        <strong>${assignedBy}</strong>.
      </p>

      <p><strong>Updated Task Details:</strong></p>

      <ul>
        ${description ? `<li><strong>Description:</strong> ${description}</li>` : ''}
        ${status ? `<li><strong>Status:</strong> ${status}</li>` : ''}
        ${priority ? `<li><strong>Priority:</strong> ${priority}</li>` : ''}
        ${dueDate ? `<li><strong>Due Date:</strong> ${new Date(dueDate).toDateString()}</li>` : ''}
      </ul>

      <p style="margin-top: 20px;">
        To view or continue working on this task, please open the application
        and check your task list.
      </p>

      <p style="font-size: 13px; color: #777;">
        This is an automated notification. No action is required via email.
      </p>

      <hr style="border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} DevDash
      </p>

    </div>
  `,
});


const teamInvitationTemplate = ({
  senderName,
  senderUsername,
  teamName,
  teamTitle,
  teamDescription,
  members,
  customMessage,
}) => ({
  subject: `Team Invitation Received: ${teamName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">

      <h3>Team Invitation Notification</h3>

      <p>
        You have received a team invitation from
        <strong>${senderName}</strong> (@${senderUsername}).
      </p>

      <p>
        <strong>Team Name:</strong> ${teamName}
      </p>

      ${
        teamTitle
          ? `<p><strong>Team Title:</strong> ${teamTitle}</p>`
          : ''
      }

      ${
        teamDescription
          ? `<p><strong>Team Description:</strong><br/>${teamDescription}</p>`
          : ''
      }

      ${
        members?.length
          ? `
            <p><strong>Current Members:</strong></p>
            <p style="margin-left: 10px;">
              ${members.map(m => m.name || m.username).join(', ')}
            </p>
          `
          : ''
      }

      ${
        customMessage
          ? `
            <p><strong>Message from ${senderName}:</strong></p>
            <p style="font-style: italic; color: #555;">
              "${customMessage}"
            </p>
          `
          : ''
      }

      <p style="margin-top: 20px;">
        To respond to this invitation, please open the application and continue
        from your notifications or team invites section.
      </p>

      <p style="font-size: 13px; color: #777;">
        This is an automated notification. No action is required via email.
      </p>

      <hr style="border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} DevDash
      </p>

    </div>
  `,
});

const taskAssginmentTemplate= ({title, description, status, priority, dueDate, assignedBy})=> ({
    subject: `New Task Assigned: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
  
        <h3>New Task Assignment</h3>
  
        <p>
          You have been assigned a new task by
          <strong>${assignedBy}</strong>.
        </p>
  
        <p><strong>Task Details:</strong></p>
  
        <ul>
          ${description ? `<li><strong>Description:</strong> ${description}</li>` : ''}
          ${status ? `<li><strong>Status:</strong> ${status}</li>` : ''}
          ${priority ? `<li><strong>Priority:</strong> ${priority}</li>` : ''}
          ${dueDate ? `<li><strong>Due Date:</strong> ${new Date(dueDate).toDateString()}</li>` : ''}
        </ul>
  
        <p style="margin-top: 20px;">
          To view or start working on this task, please open the application
          and check your task list.
        </p>
  
        <p style="font-size: 13px; color: #777;">
          This is an automated notification. No action is required via email.
        </p>
  
        <hr style="border: none; border-top: 1px solid #eee;" />
  
        <p style="font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} DevDash
        </p>
  
      </div>
    `,
});     


module.exports= {forgetPasswordTemplate, registrationTemplate, changePasswordRequest, updateTaskTemplate, teamInvitationTemplate, taskAssginmentTemplate};